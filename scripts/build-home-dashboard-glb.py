"""Assemble le boîtier du home-dashboard en GLB pour la carte 3D du portfolio.

Le 3MF (~/Code/dashboard/hardware/case/Dashboard.3mf) est un plateau
d'impression, pas un assemblage : les pièces y sont posées à plat. On ne garde
que le socle rail (pièce 1) et la plaque écran (pièce 3), remontés à la main :
la plaque est glissée dans la rainure inclinée du socle, puis un quad texturé
avec le rendu e-paper (server/scripts/preview.png) est plaqué sur sa face
avant. Recentrage sur 0,0,0 (camera-target du ModelViewer), le repère des
pièces étant déjà Y-up, puis export d'un GLB brut :

    python3 scripts/build-home-dashboard-glb.py
    bunx @gltf-transform/cli optimize public/models/home-dashboard.raw.glb \
        public/models/home-dashboard.v1.glb \
        --compress false --texture-compress false --simplify-error 0.001
    rm public/models/home-dashboard.raw.glb

Dépendances : trimesh + Pillow (python3 système). Le .raw.glb ne se commite
pas, seul le .v1.glb optimisé est versionné (incrémenter le suffixe à chaque
régénération, le fichier est servi avec un Cache-Control immutable).
"""

import os
import sys

import numpy as np
import trimesh
from PIL import Image

CASE_3MF = os.path.expanduser("~/Code/dashboard/hardware/case/Dashboard.3mf")
SCREEN_PNG = os.path.expanduser("~/Code/dashboard/server/scripts/preview.png")
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "public", "models", "home-dashboard.raw.glb")

# Géométrie de la rainure du socle, relevée sur la section x=0 de la pièce 1
# (repère local du socle : x = longueur, y = hauteur, z = profondeur, avant
# du device côté +z, lèvre chanfreinée basse). La rainure est inclinée
# d'environ 10° (haut vers -z, l'arrière) ; la plaque y repose sur une marche
# à y=-0.4, sa face arrière contre le mur arrière à z=13.8.
SLOT_FLOOR_Y = -0.4         # marche où repose le chant bas de la plaque
SLOT_BACK_Z_BOTTOM = 13.8   # mur arrière de la rainure, au niveau de la marche
TILT_DEG = -10.2            # inclinaison de l'écran (haut vers -z, l'arrière)

# Zone active du panneau 10.85" : diagonale 275.6 mm pour 1360x480 px
ACTIVE_W = 259.9
ACTIVE_H = 91.7

BLACK_PLA = dict(baseColorFactor=[0.055, 0.055, 0.06, 1.0],
                 metallicFactor=0.0, roughnessFactor=0.6)
WHITE_FRAME = dict(baseColorFactor=[0.91, 0.91, 0.9, 1.0],
                   metallicFactor=0.0, roughnessFactor=0.5)


def solid(mesh, name, **pbr):
    mesh.visual = trimesh.visual.TextureVisuals(
        material=trimesh.visual.material.PBRMaterial(name=name, **pbr))
    return mesh


def screen_quad(image):
    """Quad texturé aux dimensions de la zone active, dans le plan XY."""
    w, h = ACTIVE_W / 2, ACTIVE_H / 2
    vertices = np.array([[-w, -h, 0], [w, -h, 0], [w, h, 0], [-w, h, 0]],
                        dtype=float)
    faces = np.array([[0, 1, 2], [0, 2, 3]])
    # uv en convention OpenGL (origine en bas à gauche), trimesh gère le flip
    uv = np.array([[0, 0], [1, 0], [1, 1], [0, 1]], dtype=float)
    material = trimesh.visual.material.PBRMaterial(
        name="epaper", baseColorTexture=image,
        metallicFactor=0.0, roughnessFactor=0.85)
    quad = trimesh.Trimesh(vertices=vertices, faces=faces, process=False)
    quad.visual = trimesh.visual.TextureVisuals(uv=uv, material=material)
    return quad


def main():
    src = trimesh.load(CASE_3MF)
    base = solid(src.geometry["1"].copy(), "pla-black", **BLACK_PLA)
    plate = solid(src.geometry["3"].copy(), "epaper-frame", **WHITE_FRAME)

    # Le socle est retourné de 180° autour de l'axe vertical : sa grande face
    # avant (le mur haut) doit se trouver côté spectateur (+z) et masquer le
    # bas de l'écran, comme sur la photo du device, la masse restant derrière
    # pour soutenir l'inclinaison.
    base.apply_transform(trimesh.transformations.rotation_matrix(
        np.pi, [0, 1, 0]))

    # Le socle sert de repère : x = longueur, y = hauteur, z = profondeur.
    # Le quad e-paper est construit dans le repère local de la plaque
    # (centrée, face avant à z=+2.5), plaqué 0.25 mm devant elle, pour subir
    # ensuite exactement la même transformation qu'elle.
    image = Image.open(SCREEN_PNG).convert("RGB")
    quad = screen_quad(image)
    quad.apply_translation([0, 0, plate.bounds[1][2] + 0.25])

    # La plaque (270.6 x 106.8 x 5) est redressée dans la rainure : inclinée
    # de TILT_DEG autour de x, puis son coin bas-arrière (y min, z min) est
    # posé sur la marche, contre le mur arrière.
    tilt = trimesh.transformations.rotation_matrix(
        np.radians(TILT_DEG), [1, 0, 0])
    corner = np.array([0.0, plate.bounds[0][1], plate.bounds[0][2], 1.0])
    plate.apply_transform(tilt)
    quad.apply_transform(tilt)

    corner = tilt @ corner
    offset = [0.0, SLOT_FLOOR_Y - corner[1], SLOT_BACK_Z_BOTTOM - corner[2]]
    plate.apply_translation(offset)
    quad.apply_translation(offset)

    scene = trimesh.Scene()
    scene.add_geometry(base, geom_name="base")
    scene.add_geometry(plate, geom_name="plate")
    scene.add_geometry(quad, geom_name="screen")

    # recentre sur 0,0,0 (camera-target du ModelViewer) ; le repère
    # d'assemblage est déjà Y-up avec la face écran vers +z, rien à tourner
    scene.apply_translation(-scene.bounds.mean(axis=0))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    scene.export(OUT)
    size_mb = os.path.getsize(OUT) / 1e6
    print(f"{OUT} ({size_mb:.1f} MB, {len(scene.geometry)} geometries)")
    print("bounds:", np.round(scene.bounds, 1).tolist())


if __name__ == "__main__":
    main()
