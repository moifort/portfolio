"""Convertit l'assemblage 3MF de l'abri Netatmo en GLB pour la carte 3D du portfolio.

Charge le 3MF d'assemblage (toutes les pièces positionnées), retire la base de
table (stand_v2) pour ne garder que le montage sur bras mural, applique un
matériau PETG blanc, recentre et passe de Z-up (3MF) à Y-up (glTF), puis
exporte un GLB brut. L'optimisation (dedup, weld, simplify, quantize) se fait
ensuite avec gltf-transform :

    python3 scripts/build-sensor-shield-glb.py [chemin/vers/assemblage.3mf]
    bunx @gltf-transform/cli optimize public/models/sensor-shield.raw.glb \
        public/models/sensor-shield.v1.glb \
        --compress false --texture-compress false --simplify-error 0.001
    rm public/models/sensor-shield.raw.glb

Dépendance : trimesh (python3 système). Le .raw.glb ne se commite pas, seul le
.v1.glb optimisé est versionné (incrémenter le suffixe à chaque régénération,
le fichier est servi avec un Cache-Control immutable).
"""

import os
import sys

import numpy as np
import trimesh

DEFAULT_SRC = os.path.expanduser(
    "~/Downloads/Netatmo_Shield_70mm/Netatmo_Shield_70mm_assemblage.3mf"
)
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "public", "models", "sensor-shield.raw.glb")


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC
    scene = trimesh.load(src)
    scene.delete_geometry("stand_v2")

    material = trimesh.visual.material.PBRMaterial(
        name="petg-white",
        baseColorFactor=[0.93, 0.92, 0.89, 1.0],
        metallicFactor=0.0,
        roughnessFactor=0.45,
    )
    for geometry in scene.geometry.values():
        geometry.visual = trimesh.visual.TextureVisuals(material=material)

    # Origine sur l'axe de la pile d'anneaux (x=0, y=-24 dans le 3mf, cf.
    # arm_saddle_axis_y de generator/package.py) : model-viewer fait pivoter
    # le modèle autour du camera-target, posé à 0,0,0 dans le composant.
    scene.apply_translation([0.0, 24.0, -scene.bounds[:, 2].mean()])
    scene.apply_transform(trimesh.transformations.rotation_matrix(
        -np.pi / 2, [1, 0, 0]))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    scene.export(OUT)
    size_mb = os.path.getsize(OUT) / 1e6
    print(f"{OUT} ({size_mb:.1f} MB, {len(scene.geometry)} geometries)")


if __name__ == "__main__":
    main()
