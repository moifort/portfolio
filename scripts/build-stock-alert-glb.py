"""Modélise le montage stock-alert (XIAO MG24 + VL53L1X) en GLB pour la carte 3D.

Le repo stock-alert n'a aucun asset 3D : tout est construit procéduralement en
trimesh, en millimètres et en Z-up. Une carte Seeed XIAO MG24 stylisée (PCB
noir, USB-C, blindage RF, antenne céramique, pads dorés) est posée à plat,
reliée par quatre fils Dupont (Bézier balayée) à un breakout VL53L1X façon
Pololu (PCB bleu, boîtier ToF avec émetteur/récepteur), incliné pour pointer
sa lentille vers le spectateur. Passage Z-up vers Y-up puis recentrage sur
0,0,0 (camera-target du ModelViewer), export d'un GLB brut :

    python3 scripts/build-stock-alert-glb.py
    bunx @gltf-transform/cli optimize public/models/stock-alert.raw.glb \
        public/models/stock-alert.v1.glb \
        --compress false --texture-compress false --simplify-error 0.001
    rm public/models/stock-alert.raw.glb

Dépendances : trimesh + shapely (python3 système). Le .raw.glb ne se commite
pas, seul le .v1.glb optimisé est versionné (incrémenter le suffixe à chaque
régénération, le fichier est servi avec un Cache-Control immutable).
"""

import os

import numpy as np
import trimesh
from shapely.geometry import Point

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "public", "models", "stock-alert.raw.glb")

PCB_BLACK = dict(baseColorFactor=[0.05, 0.055, 0.06, 1.0],
                 metallicFactor=0.0, roughnessFactor=0.55)
PCB_BLUE = dict(baseColorFactor=[0.05, 0.13, 0.35, 1.0],
                metallicFactor=0.0, roughnessFactor=0.5)
STEEL = dict(baseColorFactor=[0.75, 0.76, 0.78, 1.0],
             metallicFactor=0.9, roughnessFactor=0.3)
SHIELD_STEEL = dict(baseColorFactor=[0.72, 0.73, 0.75, 1.0],
                    metallicFactor=0.9, roughnessFactor=0.4)
CERAMIC = dict(baseColorFactor=[0.82, 0.78, 0.7, 1.0],
               metallicFactor=0.0, roughnessFactor=0.6)
GOLD = dict(baseColorFactor=[0.85, 0.66, 0.2, 1.0],
            metallicFactor=1.0, roughnessFactor=0.3)
TOF_HOUSING = dict(baseColorFactor=[0.04, 0.04, 0.045, 1.0],
                   metallicFactor=0.0, roughnessFactor=0.2)
TOF_LENS = dict(baseColorFactor=[0.02, 0.02, 0.03, 1.0],
                metallicFactor=0.0, roughnessFactor=0.1)
PASSIVE = dict(baseColorFactor=[0.45, 0.38, 0.3, 1.0],
               metallicFactor=0.2, roughnessFactor=0.5)
WIRE_COLORS = {  # 3V3, SDA, SCL, GND
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

# Breakout VL53L1X : PCB 13 x 18, pads côté XIAO (x-min local), incliné pour
# soulever la lentille, puis posé en x=+14.5.
BREAKOUT_TILT_DEG = -28.0
BREAKOUT_SHIFT = 14.5
BREAKOUT_PAD_X = -5.2
BREAKOUT_PAD_YS = [3.81, 1.27, -1.27, -3.81]


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
    """Carte XIAO MG24 stylisée, à plat, centrée en (XIAO_C, 0)."""
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
    """Breakout VL53L1X en repère local (PCB centré en 0,0), avant bascule."""
    pcb = box((13, 18, 1.0), (0, 0, 0.5))
    housing = box((4.9, 2.5, 1.56), (1.2, 0, 1.78))
    lenses = trimesh.util.concatenate([
        cylinder(0.5, 0.12, (1.2 + dx, 0, 2.62)) for dx in (-1.4, 1.4)
    ])
    passives = trimesh.util.concatenate([
        box((2.0, 1.2, 0.9), (-1.8, 4.8, 1.45)),
        box((1.5, 1.5, 0.8), (-1.8, -4.8, 1.4)),
    ])
    pads = trimesh.util.concatenate([
        cylinder(0.55, 0.15, (BREAKOUT_PAD_X, y, 1.075))
        for y in BREAKOUT_PAD_YS
    ])
    return pcb, housing, lenses, passives, pads


def breakout_transform():
    """Bascule autour du bord des pads (qui reste au sol) puis pose en +x."""
    tilt = trimesh.transformations.rotation_matrix(
        np.radians(BREAKOUT_TILT_DEG), [0, 1, 0], point=[-6.5, 0, 0])
    shift = trimesh.transformations.translation_matrix([BREAKOUT_SHIFT, 0, 0])
    return shift @ tilt


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
    scene.add_geometry(solid(antenna, "antenna", **CERAMIC),
                       geom_name="antenna")
    scene.add_geometry(solid(pads, "xiao-pads", **GOLD), geom_name="xiao-pads")

    placed = breakout_transform()
    b_pcb, housing, lenses, passives, b_pads = breakout_parts()
    for mesh in (b_pcb, housing, lenses, passives, b_pads):
        mesh.apply_transform(placed)
    scene.add_geometry(solid(b_pcb, "tof-pcb", **PCB_BLUE), geom_name="tof-pcb")
    scene.add_geometry(solid(housing, "tof-housing", **TOF_HOUSING),
                       geom_name="tof-housing")
    scene.add_geometry(solid(lenses, "tof-lenses", **TOF_LENS),
                       geom_name="tof-lenses")
    scene.add_geometry(solid(passives, "tof-passives", **PASSIVE),
                       geom_name="tof-passives")
    scene.add_geometry(solid(b_pads, "tof-pads", **GOLD), geom_name="tof-pads")

    # Quatre fils : départ sur les 4 pads du XIAO les plus proches du breakout
    # (2 par rangée), arrivée sur les pads du breakout, dans le repère basculé.
    starts = [(-6.38, PAD_ROW_Y, 1.1), (-8.92, PAD_ROW_Y, 1.1),
              (-8.92, -PAD_ROW_Y, 1.1), (-6.38, -PAD_ROW_Y, 1.1)]
    end_normal = (placed[:3, :3] @ [0, 0, 1.0])
    for i, (name, color) in enumerate(WIRE_COLORS.items()):
        end_local = np.array([BREAKOUT_PAD_X, BREAKOUT_PAD_YS[i], 1.1, 1.0])
        end = (placed @ end_local)[:3]
        mesh = wire(starts[i], end, end_normal, 6.5 + i * 0.6, name, color)
        scene.add_geometry(mesh, geom_name=f"wire-{name}")

    # Z-up (construction) vers Y-up (glTF).
    scene.apply_transform(trimesh.transformations.rotation_matrix(
        -np.pi / 2, [1, 0, 0]))
    # Redresse l'assemblage : l'axe long (X, ~45 mm) devient vertical (Y).
    # model-viewer fait tourner autour de Y, donc le montage tourne sur lui
    # même dans le sens de la longueur, et remplit la colonne haute du viewer.
    scene.apply_transform(trimesh.transformations.rotation_matrix(
        np.pi / 2, [0, 0, 1]))
    # Recentrage sur 0,0,0 en toute dernière transformation : le débord USB-C
    # et l'arche des fils décalent les bounds, et model-viewer pivote autour de
    # camera-target=0,0,0.
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
