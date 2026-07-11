"""Modélise le montage water-consuption (XIAO + CC1101 868 MHz) en GLB.

Le repo water-consuption n'a aucun asset 3D exploitable : tout est construit
procéduralement en trimesh, en millimètres et en Z-up, sur le modèle du script
stock-alert. Une carte Seeed XIAO stylisée (PCB noir, USB-C, blindage RF,
antenne céramique, pads dorés) est posée à plat, reliée par quatre fils Dupont
(Bézier balayée) à un breakout CC1101 vert classique, redressé presque à la
verticale. Sur le pad ANT du breakout est soudée une antenne 868 MHz en queue
de cochon : une hélice cuivrée (disque balayé le long d'un chemin hélicoïdal)
qui s'élève en diagonale au-dessus du montage, l'élément vedette de la carte.
Passage Z-up vers Y-up puis recentrage sur 0,0,0 (camera-target du
ModelViewer), export d'un GLB brut :

    python3 scripts/build-water-meter-glb.py
    bunx @gltf-transform/cli optimize public/models/water-meter.raw.glb \
        public/models/water-meter.v1.glb \
        --compress false --texture-compress false --simplify-error 0.001
    rm public/models/water-meter.raw.glb

Dépendances : trimesh + shapely (python3 système). Le .raw.glb ne se commite
pas, seul le .v1.glb optimisé est versionné (incrémenter le suffixe à chaque
régénération, le fichier est servi avec un Cache-Control immutable).
"""

import os

import numpy as np
import trimesh
from shapely.geometry import Point

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "public", "models", "water-meter.raw.glb")

PCB_BLACK = dict(baseColorFactor=[0.05, 0.055, 0.06, 1.0],
                 metallicFactor=0.0, roughnessFactor=0.55)
PCB_GREEN = dict(baseColorFactor=[0.05, 0.3, 0.13, 1.0],
                 metallicFactor=0.0, roughnessFactor=0.5)
STEEL = dict(baseColorFactor=[0.75, 0.76, 0.78, 1.0],
             metallicFactor=0.9, roughnessFactor=0.3)
SHIELD_STEEL = dict(baseColorFactor=[0.72, 0.73, 0.75, 1.0],
                    metallicFactor=0.9, roughnessFactor=0.4)
CERAMIC = dict(baseColorFactor=[0.82, 0.78, 0.7, 1.0],
               metallicFactor=0.0, roughnessFactor=0.6)
GOLD = dict(baseColorFactor=[0.85, 0.66, 0.2, 1.0],
            metallicFactor=1.0, roughnessFactor=0.3)
COPPER = dict(baseColorFactor=[0.78, 0.44, 0.2, 1.0],
              metallicFactor=1.0, roughnessFactor=0.3)
CHIP_BLACK = dict(baseColorFactor=[0.04, 0.04, 0.045, 1.0],
                  metallicFactor=0.0, roughnessFactor=0.25)
PASSIVE = dict(baseColorFactor=[0.45, 0.38, 0.3, 1.0],
               metallicFactor=0.2, roughnessFactor=0.5)
WIRE_COLORS = {  # 3V3, MOSI, SCK, GND
    "red": [0.75, 0.1, 0.08, 1.0],
    "yellow": [0.85, 0.7, 0.1, 1.0],
    "blue": [0.1, 0.3, 0.75, 1.0],
    "black": [0.08, 0.08, 0.09, 1.0],
}

# XIAO : PCB 21 x 17.8, posé à plat, centré en x=-14, USB-C côté x-min.
XIAO_C = -14.0
XIAO_TOP = 1.0
PAD_ROW_Y = 17.8 / 2 - 1.35
PAD_PITCH = 2.54

# Breakout CC1101 : PCB 22 x 15, header 2x4 côté XIAO (x-min local), redressé
# presque à la verticale pour que l'antenne s'élève, puis posé en x=+13.
BREAKOUT_TILT_DEG = -58.0
BREAKOUT_SHIFT = 13.0
BREAKOUT_PAD_X = -10.2
BREAKOUT_PAD_X2 = BREAKOUT_PAD_X + PAD_PITCH
BREAKOUT_PAD_YS = [3.81, 1.27, -1.27, -3.81]
# Pad ANT au bord opposé (x-max local), sur la face composants.
ANT_PAD = (10.2, 0.0, 1.0)


def solid(mesh, name, **pbr):
    mesh.visual = trimesh.visual.TextureVisuals(
        material=trimesh.visual.material.PBRMaterial(name=name, **pbr))
    return mesh


def box(size, center):
    mesh = trimesh.creation.box(size)
    mesh.apply_translation(center)
    return mesh


def cylinder(radius, height, center, axis="z"):
    mesh = trimesh.creation.cylinder(radius=radius, height=height, sections=24)
    if axis == "x":
        mesh.apply_transform(trimesh.transformations.rotation_matrix(
            np.pi / 2, [0, 1, 0]))
    mesh.apply_translation(center)
    return mesh


def xiao_parts():
    """Carte XIAO stylisée, à plat, centrée en (XIAO_C, 0)."""
    pcb = box((21, 17.8, 1.0), (XIAO_C, 0, 0.5))

    # USB-C au bord x-min, débordant de 1.5 mm : corps + flancs arrondis
    usb_z = XIAO_TOP + 1.6
    usb = trimesh.util.concatenate([
        box((9, 4.3, 3.2), (-21.5, 0, usb_z)),
        cylinder(1.6, 9, (-21.5, 2.15, usb_z), axis="x"),
        cylinder(1.6, 9, (-21.5, -2.15, usb_z), axis="x"),
    ])

    shield = box((7, 7, 1.1), (-11.5, 0, XIAO_TOP + 0.55))
    antenna = box((1.5, 6, 0.9), (-4.6, 0, XIAO_TOP + 0.45))

    pads = trimesh.util.concatenate([
        cylinder(0.55, 0.15, (XIAO_C + (i - 3) * PAD_PITCH, row,
                              XIAO_TOP + 0.075))
        for i in range(7) for row in (PAD_ROW_Y, -PAD_ROW_Y)
    ])
    return pcb, usb, shield, antenna, pads


def breakout_parts():
    """Breakout CC1101 vert en repère local (PCB centré en 0,0), avant bascule."""
    pcb = box((22, 15, 1.0), (0, 0, 0.5))
    chip = box((5, 5, 0.9), (0.5, -1.5, 1.45))          # CC1101 QFN
    crystal = trimesh.util.concatenate([                 # quartz HC-49 SMD
        box((3.6, 2.4, 1.0), (1.0, 4.5, 1.5)),
        cylinder(0.5, 3.6, (2.8, 4.5, 1.5), axis="x"),
    ])
    passives = trimesh.util.concatenate([
        box((1.6, 0.9, 0.6), pos) for pos in (
            (5.5, -4.5, 1.3), (7.2, -4.5, 1.3), (5.5, 3.5, 1.3),
            (-3.5, -4.8, 1.3), (-3.5, 4.8, 1.3),
        )
    ])
    pads = trimesh.util.concatenate([                    # header 2x4 côté XIAO
        cylinder(0.55, 0.15, (col, y, 1.075))
        for col in (BREAKOUT_PAD_X, BREAKOUT_PAD_X2) for y in BREAKOUT_PAD_YS
    ])
    solder = cylinder(1.3, 0.7, (ANT_PAD[0], ANT_PAD[1], ANT_PAD[2] + 0.2))
    return pcb, chip, crystal, passives, pads, solder


def breakout_transform():
    """Bascule autour du bord du header (qui reste au sol) puis pose en +x."""
    tilt = trimesh.transformations.rotation_matrix(
        np.radians(BREAKOUT_TILT_DEG), [0, 1, 0], point=[-11.0, 0, 0])
    shift = trimesh.transformations.translation_matrix([BREAKOUT_SHIFT, 0, 0])
    return shift @ tilt


def pigtail():
    """Antenne queue de cochon : disque de 0.65 mm balayé le long d'une hélice
    (rayon de spire 2.6 mm, 6.5 tours sur 17 mm), avec un tronçon droit à la
    base (la soudure sur le pad ANT) et une pointe droite courte au sommet.
    Construite le long de +z, à orienter/poser par transformation."""
    r, turns, height = 2.4, 8.5, 14.5
    pts = [[r, 0, -2.2], [r, 0, -0.8]]
    n = int(turns * 16)
    for i in range(n + 1):
        a = 2 * np.pi * turns * i / n
        pts.append([r * np.cos(a), r * np.sin(a), height * i / n])
    a_end = 2 * np.pi * turns
    pts.append([r * np.cos(a_end) * 0.4, r * np.sin(a_end) * 0.4, height + 2.5])
    mesh = trimesh.creation.sweep_polygon(
        Point(0, 0).buffer(0.65, quad_segs=3), np.array(pts))
    return solid(mesh, "pigtail", **COPPER)


def wire(start, end, end_normal, arch, name, color):
    """Fil Dupont : Bézier cubique balayée par un disque de rayon 0.55 mm."""
    p0, p3 = np.array(start), np.array(end)
    p1 = p0 + [0.6, 0, arch]
    p2 = p3 + np.asarray(end_normal) * arch * 0.8
    t = np.linspace(0.0, 1.0, 40)[:, None]
    path = ((1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1
            + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3)
    mesh = trimesh.creation.sweep_polygon(
        Point(0, 0).buffer(0.55, quad_segs=4), path)
    return solid(mesh, f"wire-{name}", metallicFactor=0.0,
                 roughnessFactor=0.45, baseColorFactor=color)


def main():
    scene = trimesh.Scene()

    pcb, usb, shield, antenna, pads = xiao_parts()
    scene.add_geometry(solid(pcb, "xiao-pcb", **PCB_BLACK), geom_name="xiao-pcb")
    scene.add_geometry(solid(usb, "usb-c", **STEEL), geom_name="usb-c")
    scene.add_geometry(solid(shield, "rf-shield", **SHIELD_STEEL),
                       geom_name="rf-shield")
    scene.add_geometry(solid(antenna, "xiao-antenna", **CERAMIC),
                       geom_name="xiao-antenna")
    scene.add_geometry(solid(pads, "xiao-pads", **GOLD), geom_name="xiao-pads")

    placed = breakout_transform()
    b_pcb, chip, crystal, passives, b_pads, solder = breakout_parts()
    for mesh in (b_pcb, chip, crystal, passives, b_pads, solder):
        mesh.apply_transform(placed)
    scene.add_geometry(solid(b_pcb, "cc1101-pcb", **PCB_GREEN),
                       geom_name="cc1101-pcb")
    scene.add_geometry(solid(chip, "cc1101-chip", **CHIP_BLACK),
                       geom_name="cc1101-chip")
    scene.add_geometry(solid(crystal, "crystal", **STEEL), geom_name="crystal")
    scene.add_geometry(solid(passives, "cc1101-passives", **PASSIVE),
                       geom_name="cc1101-passives")
    scene.add_geometry(solid(b_pads, "cc1101-pads", **GOLD),
                       geom_name="cc1101-pads")
    scene.add_geometry(solid(solder, "ant-solder", **STEEL),
                       geom_name="ant-solder")

    # L'antenne queue de cochon : construite le long de +z, orientée le long de
    # +x local (elle prolonge le PCB comme sur les vrais modules), soudée sur le
    # pad ANT, puis basculée avec le breakout.
    ant = pigtail()
    ant.apply_transform(trimesh.transformations.rotation_matrix(
        np.pi / 2, [0, 1, 0]))
    ant.apply_translation(ANT_PAD)
    ant.apply_transform(placed)
    scene.add_geometry(ant, geom_name="pigtail")

    # Quatre fils : départ sur les 4 pads du XIAO les plus proches du breakout
    # (2 par rangée), arrivée sur la colonne externe du header, repère basculé.
    starts = [(-6.38, PAD_ROW_Y, 1.1), (-8.92, PAD_ROW_Y, 1.1),
              (-8.92, -PAD_ROW_Y, 1.1), (-6.38, -PAD_ROW_Y, 1.1)]
    end_normal = (placed[:3, :3] @ [0, 0, 1.0])
    for i, (name, color) in enumerate(WIRE_COLORS.items()):
        end_local = np.array([BREAKOUT_PAD_X, BREAKOUT_PAD_YS[i], 1.1, 1.0])
        end = (placed @ end_local)[:3]
        mesh = wire(starts[i], end, end_normal, 6.5 + i * 0.6, name, color)
        scene.add_geometry(mesh, geom_name=f"wire-{name}")

    # Z-up (construction) vers Y-up (glTF) : le montage reste à plat (plateau
    # tournant), le breakout redressé et son antenne hélicoïdale s'élèvent en
    # diagonale. model-viewer pivote autour de Y : l'antenne balaie un cercle
    # au-dessus du montage.
    scene.apply_transform(trimesh.transformations.rotation_matrix(
        -np.pi / 2, [1, 0, 0]))
    # Recentrage sur 0,0,0 en toute dernière transformation : l'antenne décale
    # les bounds, et model-viewer pivote autour de camera-target=0,0,0.
    scene.apply_translation(-scene.bounds.mean(axis=0))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    scene.export(OUT)
    size_kb = os.path.getsize(OUT) / 1e3
    faces = sum(g.faces.shape[0] for g in scene.geometry.values())
    print(f"{OUT} ({size_kb:.0f} KB, {len(scene.geometry)} geometries, "
          f"{faces} faces)")
    print("bounds:", np.round(scene.bounds, 1).tolist())


if __name__ == "__main__":
    main()
