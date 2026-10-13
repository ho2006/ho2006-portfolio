import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export function createMacbook(keyboardTexture) {
  const laptop = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({
    color: "#cbd0d6",
    metalness: 0.72,
    roughness: 0.3,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: "#23262b",
    roughness: 0.66,
    metalness: 0.15,
  });
  const hinge = new THREE.MeshStandardMaterial({
    color: "#979da5",
    metalness: 0.8,
    roughness: 0.36,
  });
  function box(parent, width, height, depth, material, x, y, z, radius = 0.05) {
    const mesh = new THREE.Mesh(
      new RoundedBoxGeometry(width, height, depth, 2, radius),
      material,
    );
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  const base = box(laptop, 6.8, 0.24, 4.5, metal, 0, 0, 0, 0.1);
  const vertices = base.geometry.attributes.position;
  for (let index = 0; index < vertices.count; index++) {
    vertices.setY(
      index,
      vertices.getY(index) *
        (0.46 + ((2.25 - vertices.getZ(index)) / 4.5) * 0.54),
    );
  }
  base.geometry.computeVertexNormals();
  box(laptop, 5.75, 0.024, 1.92, hinge, 0, 0.127, -0.61, 0.09);

  // The keyboard shares geometry and materials to keep the model light.
  const keyGeometry = new RoundedBoxGeometry(0.355, 0.045, 0.265, 1, 0.025);
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 14; column++) {
      const key = new THREE.Mesh(keyGeometry, dark);
      key.position.set((column - 6.5) * 0.396, 0.162, -1.32 + row * 0.317);
      laptop.add(key);
    }
  }
  box(laptop, 2.5, 0.045, 0.26, dark, 0, 0.162, 0.265, 0.024);
  for (const x of [-2.6, -2.12, -1.62, 1.62, 2.12, 2.6])
    box(laptop, 0.41, 0.045, 0.26, dark, x, 0.162, 0.265, 0.025);
  if (keyboardTexture) {
    const labels = new THREE.Mesh(
      new THREE.PlaneGeometry(5.55, 1.57),
      new THREE.MeshBasicMaterial({
        map: keyboardTexture,
        transparent: true,
        depthWrite: false,
      }),
    );
    labels.rotation.x = -Math.PI / 2;
    labels.position.set(0, 0.189, -0.68);
    laptop.add(labels);
  }
  box(laptop, 1.88, 0.013, 1.14, hinge, 0, 0.111, 1.22, 0.055);
  box(laptop, 1.82, 0.014, 0.88, metal, 0, 0.119, 1.1, 0.045);
  box(laptop, 1.82, 0.012, 0.185, metal, 0, 0.12, 1.66, 0.025);
  box(laptop, 0.82, 0.018, 0.06, hinge, 0, 0.043, 2.23, 0.018);
  box(laptop, 4.75, 0.18, 0.18, hinge, 0, 0.075, -2.06, 0.06);

  const lid = new THREE.Group();
  lid.name = "lid";
  lid.position.set(0, 0.12, -2.09);
  lid.rotation.x = -0.19;
  laptop.add(lid);
  box(lid, 6.8, 4.6, 0.15, metal, 0, 2.35, 0, 0.12);
  box(lid, 6.22, 3.94, 0.023, dark, 0, 2.43, 0.082, 0.035);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(6.09, 6.09 / 1.6),
    new THREE.MeshBasicMaterial({
      color: "#b6b6b6",
      toneMapped: false,
    }),
  );
  screen.name = "screen";
  screen.position.set(0, 2.43, 0.097);
  lid.add(screen);
  box(lid, 0.058, 0.058, 0.015, dark, 0, 4.5, 0.085, 0.02);
  if (typeof document !== "undefined") {
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 512;
    labelCanvas.height = 64;
    const ctx = labelCanvas.getContext("2d");
    ctx.fillStyle = "#51565c";
    ctx.font = "22px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MacBook Air", 256, 41);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.18, 0.148),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(labelCanvas),
        transparent: true,
      }),
    );
    label.position.set(0, 0.205, 0.092);
    lid.add(label);
  }
  return { laptop, lid, screen };
}

export function disposeMacbook(laptop) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  laptop.traverse((object) => {
    if (!object.isMesh) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material)
      ? object.material
      : [object.material]) {
      materials.add(material);
      if (material.map) textures.add(material.map);
    }
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}
