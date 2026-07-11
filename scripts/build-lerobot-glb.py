"""Reconstruit le bras SO-ARM100 (SO-100 follower) en pose ouverte, en GLB.

Le STL fondu ``Mini/Mini_SO_100_01g.STL`` n'est qu'un bloc figé impossible a
reposer. On repart donc de l'URDF ``Simulation/SO100/so100.urdf`` et de ses
meshes par segment : on parcourt la chaine cinematique (base -> shoulder ->
upper_arm -> lower_arm -> wrist -> gripper -> jaw), on applique un jeu d'angles
qui *ouvre* le bras (au lieu de la pose repliee par defaut), puis on fusionne
tous les segments dans une seule matiere orange plastique mat facon plot de
circulation.

L'URDF est en metres, Z-up. On bascule en Y-up (glTF) et on recentre sur
0,0,0 (camera-target du ModelViewer), base vers le bas. Export d'un GLB brut :

    python3 scripts/build-lerobot-glb.py
    bunx @gltf-transform/cli optimize public/models/lerobot.raw.glb \
        public/models/lerobot.v2.glb \
        --compress false --texture-compress false --simplify-error 0.0006
    rm public/models/lerobot.raw.glb

Dependances : trimesh + numpy (python3 systeme). Seul le .v2.glb optimise est
versionne (incrementer le suffixe a chaque regeneration, servi immutable).
"""

import os
import xml.etree.ElementTree as ET

import numpy as np
import trimesh
from trimesh.transformations import (euler_matrix, rotation_matrix,
                                      translation_matrix)

URDF = "/Users/thibaut/Code/SO-ARM100/Simulation/SO100/so100.urdf"
ASSETS = os.path.dirname(URDF)
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "public", "models", "lerobot.raw.glb")

# Orange plot de circulation. baseColorFactor est LINEAIRE en glTF : ces
# valeurs correspondent a un orange sRGB vif (~#F5601A) une fois affiche.
CONE_ORANGE = dict(baseColorFactor=[0.95, 0.12, 0.02, 1.0],
                   metallicFactor=0.0, roughnessFactor=0.5)

# Pose "ouverte" : angles (rad) par articulation. La pose par defaut (tout a 0)
# replie le bras ; on deplie l'epaule et le coude pour dresser puis etendre le
# bras, poignet legerement casse, pince entrouverte.
POSE = {
    "shoulder_pan": 0.35,    # leger quart de tour pour une vue 3/4
    "shoulder_lift": 1.35,   # dresse l'avant-bras (limite 0..3.5)
    "elbow_flex": -1.15,     # ouvre le coude (limite -3.14..0)
    "wrist_flex": -0.35,     # casse un peu le poignet
    "wrist_roll": 0.0,
    "gripper": 0.6,          # pince entrouverte
}


def load_link_mesh(link):
    """Concatene tous les visuals STL d'un link (dans son repere local)."""
    meshes = []
    for visual in link.findall("visual"):
        fn = visual.find("geometry/mesh").get("filename")
        meshes.append(trimesh.load(os.path.join(ASSETS, fn), force="mesh"))
    return trimesh.util.concatenate(meshes)


def joint_origin(joint):
    o = joint.find("origin")
    xyz = [float(v) for v in o.get("xyz", "0 0 0").split()]
    rpy = [float(v) for v in o.get("rpy", "0 0 0").split()]
    return translation_matrix(xyz) @ euler_matrix(*rpy, axes="sxyz")


def main():
    robot = ET.parse(URDF).getroot()
    links = {l.get("name"): l for l in robot.findall("link")}
    joints = robot.findall("joint")

    # Forward kinematics : transforme monde de chaque link en descendant la
    # chaine parent -> enfant depuis la base.
    world = {"base": np.eye(4)}
    changed = True
    while changed:
        changed = False
        for j in joints:
            parent = j.find("parent").get("link")
            child = j.find("child").get("link")
            if parent in world and child not in world:
                angle = POSE.get(j.get("name"), 0.0)
                axis = [float(v) for v in j.find("axis").get("xyz").split()]
                world[child] = (world[parent] @ joint_origin(j)
                                @ rotation_matrix(angle, axis))
                changed = True

    scene = trimesh.Scene()
    for name, link in links.items():
        if link.find("visual") is None:
            continue
        mesh = load_link_mesh(link)
        mesh.apply_transform(world[name])
        scene.add_geometry(mesh, geom_name=name)

    # Une seule matiere orange sur toute la geometrie fusionnee.
    dump = scene.dump(concatenate=True)
    dump.visual = trimesh.visual.TextureVisuals(
        material=trimesh.visual.material.PBRMaterial(
            name="cone-orange", **CONE_ORANGE))

    out = trimesh.Scene()
    out.add_geometry(dump, geom_name="so-arm100")
    # URDF Z-up -> glTF Y-up ; puis recentrage sur l'origine (base vers le bas).
    out.apply_transform(rotation_matrix(-np.pi / 2, [1, 0, 0]))
    out.apply_translation(-out.bounds.mean(axis=0))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    out.export(OUT)
    size_kb = os.path.getsize(OUT) / 1e3
    faces = sum(g.faces.shape[0] for g in out.geometry.values())
    print(f"{OUT} ({size_kb:.0f} KB, {faces} faces)")
    print("bounds:", np.round(out.bounds, 3).tolist())


if __name__ == "__main__":
    main()
