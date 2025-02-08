import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";

export interface BuilderApiParams {
  rootElement: HTMLElement;
}

export class BuilderApi {
  private readonly width: number;
  private readonly height: number;
  private readonly scene = new THREE.Scene();
  private readonly geometry = new THREE.BoxGeometry(50, 50, 50);
  private readonly material = new THREE.MeshNormalMaterial();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true });
  private readonly orbitControls: OrbitControls;
  private readonly transformControl: TransformControls;
  private readonly dragControls: DragControls;

  private readonly rootElement: HTMLElement;

  private readonly buildings: THREE.Object3D[] = [];

  constructor(params: BuilderApiParams) {
    this.width = params.rootElement.clientWidth;
    this.height = params.rootElement.clientHeight;

    this.rootElement = params.rootElement;

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      10000,
    );

    this.camera.position.set(500, 800, 1300);
    this.camera.lookAt(0, 0, 0);

    this.renderer.setSize(this.width, this.height);

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement,
    );

    this.transformControl = new TransformControls(
      this.camera,
      this.renderer.domElement,
    );

    this.transformControl.mode = "scale";

    this.scene.add(this.transformControl.getHelper());

    const gridHelper = new THREE.GridHelper(1000, 20);
    this.scene.add(gridHelper);

    this.dragControls = new DragControls(
      this.buildings,
      this.camera,
      this.renderer.domElement,
    );

    // Disable OrbitControls when dragging starts
    this.dragControls.addEventListener("dragstart", () => {
      this.orbitControls.enabled = false;
    });

    // Re-enable OrbitControls when dragging ends
    this.dragControls.addEventListener("dragend", () => {
      this.orbitControls.enabled = true;
    });

    // Disable OrbitControls when TransformControls is active
    this.transformControl.addEventListener("dragging-changed", (event) => {
      this.orbitControls.enabled = !event.value;
    });

    this.transformControl.addEventListener("object-changed", (event) => {
      this.dragControls.enabled = !event.value;
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.renderer.domElement.addEventListener("click", (event) => {
      const element = this.renderer.domElement;
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x =
        (event.clientX / (element.clientWidth + element.offsetLeft)) * 2 - 1;
      mouse.y =
        -(event.clientY / (element.clientHeight + element.offsetTop)) * 2 + 1;

      // Raycast from the camera through the mouse position
      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.buildings);

      // If an object is clicked, attach TransformControls to it
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        this.transformControl.attach(selectedObject);
      } else {
        this.transformControl.detach();
      }
    });
  }

  init(): void {
    this.rootElement.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });
  }

  addBuilding(): void {
    const mesh = new THREE.Mesh(this.geometry, this.material);

    if (this.buildings.length === 0) {
      mesh.position.set(25, 25, 25);
    } else {
      const lastBuilding = this.buildings.at(-1)!;

      mesh.position.set(25, 25, lastBuilding?.position.z + 100);
    }

    this.scene.add(mesh);
    this.buildings.push(mesh);
  }

  resize(): void {
    this.camera.aspect =
      this.rootElement.clientWidth / this.rootElement.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      this.rootElement.clientWidth,
      this.rootElement.clientHeight,
    );
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.rootElement.removeChild(this.renderer.domElement);
  }
}
