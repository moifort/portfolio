"""Convertit les bacs Gridfinity (3MF) en GLB pour la carte 3D défilante du portfolio.

Charge chaque bac Gridfinity, applique un matériau PETG neutre, recentre sur
l'origine (pour que le camera-target 0,0,0 de model-viewer cadre chaque bac
malgré des tailles très différentes), passe de Z-up (3MF) à Y-up (glTF), puis
exporte un GLB brut par modèle. L'optimisation se fait ensuite avec
gltf-transform :

    python3 scripts/build-gridfinity-glb.py [dossier/des/3mf]
    for f in caliper civivi multimeter zanflare; do \
        bunx @gltf-transform/cli optimize public/models/gridfinity-$f.raw.glb \
            public/models/gridfinity-$f.v1.glb \
            --compress false --texture-compress false --simplify-error 0.001; done
    rm public/models/gridfinity-*.raw.glb

Dépendance : trimesh (python3 système). Les .raw.glb ne se commitent pas, seuls
les .v1.glb optimisés sont versionnés (incrémenter le suffixe à chaque
régénération, servis avec un Cache-Control immutable).
"""

import os
import sys

import numpy as np
import trimesh

DEFAULT_SRC_DIR = os.path.expanduser("~/Downloads/gridfinity")
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       "public", "models")

# fichier 3MF -> slug de sortie (gridfinity-<slug>.raw.glb)
MODELS = {
    "caliper.3mf": "caliper",
    "civivi_elementum.3mf": "civivi",
    "multimeter_divider-2.3mf": "multimeter",
    "zanflare.3mf": "zanflare",
}


def build(src_path, slug):
    src = trimesh.load(src_path)
    mesh = (trimesh.util.concatenate(list(src.geometry.values()))
            if hasattr(src, "geometry") else src)

    # gris chaud plutôt que blanc : les faces éclairées ne saturent pas et les
    # reliefs (cavités, séparateurs) restent lisibles sous la lumière legacy
    body_material = trimesh.visual.material.PBRMaterial(
        name="petg-grey",
        baseColorFactor=[0.72, 0.71, 0.68, 1.0],
        metallicFactor=0.0,
        roughnessFactor=0.6,
    )
    mesh.visual = trimesh.visual.TextureVisuals(material=body_material)

    scene = trimesh.Scene()
    scene.add_geometry(mesh, geom_name="body")

    # Recentrer sur le centre de la bounding box : model-viewer fait pivoter le
    # modèle autour du camera-target posé à 0,0,0, et cadre chaque bac malgré
    # des dimensions très différentes.
    center = scene.bounds.mean(axis=0)
    scene.apply_translation(-center)
    # Z-up (3MF) -> Y-up (glTF)
    scene.apply_transform(trimesh.transformations.rotation_matrix(
        -np.pi / 2, [1, 0, 0]))

    out = os.path.join(OUT_DIR, f"gridfinity-{slug}.raw.glb")
    scene.export(out)
    size_mb = os.path.getsize(out) / 1e6
    print(f"{out} ({size_mb:.1f} MB, {len(scene.geometry)} geometries)")


def main():
    src_dir = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC_DIR
    os.makedirs(OUT_DIR, exist_ok=True)
    for filename, slug in MODELS.items():
        build(os.path.join(src_dir, filename), slug)


if __name__ == "__main__":
    main()
