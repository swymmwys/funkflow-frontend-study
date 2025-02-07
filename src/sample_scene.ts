import * as THREE from "three";

export function renderScene() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // init

  const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
  camera.position.z = 1;

  const scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const material = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);

  let x: number = 0;
  let y: number = 0;

  document.addEventListener("mousemove", (event) => {
    x = event.x;
    y = event.y;
  });

  // animation

  const velocity = 5;

  function animate(): void {
    mesh.rotation.y = (x / document.body.clientWidth) * -velocity;
    mesh.rotation.x = (y / document.body.clientHeight) * velocity;

    renderer.render(scene, camera);
  }
}
