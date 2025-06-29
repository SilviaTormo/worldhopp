import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

interface NodePoint {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

@Component({
  selector: 'app-ultron-interface',
  templateUrl: './ultron-interface.component.html',
  styleUrls: ['./ultron-interface.component.css']
})
export class UltronInterfaceComponent implements AfterViewInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true }) canvasRef: ElementRef;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private composer: EffectComposer;

  private nodes: NodePoint[] = [];
  private nodeMesh: THREE.InstancedMesh;
  private particleGeom: THREE.BufferGeometry;
  private particleMat: THREE.PointsMaterial;
  private particles: THREE.Points;
  private frameId: number = 0;

  ngAfterViewInit() {
    this.initScene();
    this.createNetwork();
    this.createParticles();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initScene() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 50);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement, antialias: true });
    this.renderer.setSize(width, height);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // postprocessing
    const renderScene = new RenderPass(this.scene, this.camera);
    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloom);
  }

  private createNetwork() {
    const nodeCount = 20;
    const geometry = new THREE.SphereBufferGeometry(0.3, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.nodeMesh = new THREE.InstancedMesh(geometry, material, nodeCount);

    for (let i = 0; i < nodeCount; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      const velocity = new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);
      this.nodes.push({ position, velocity });
      const matrix = new THREE.Matrix4().setPosition(position);
      this.nodeMesh.setMatrixAt(i, matrix);
    }
    this.scene.add(this.nodeMesh);

    const connections: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < 0.2) {
          connections.push(i, j);
        }
      }
    }

    const connGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(connections.length * 3);
    connGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const connMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7 });
    const lines = new THREE.LineSegments(connGeom, connMat);
    (lines as any).userData.connections = connections;
    this.scene.add(lines);
  }

  private createParticles() {
    const count = 500;
    this.particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    this.particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeom.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    this.particleMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.1 });
    this.particles = new THREE.Points(this.particleGeom, this.particleMat);
    this.scene.add(this.particles);
  }

  private updateNodes() {
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.position.add(node.velocity);
      if (node.position.length() > 20) {
        node.position.multiplyScalar(-1);
      }
      const matrix = new THREE.Matrix4().setPosition(node.position);
      this.nodeMesh.setMatrixAt(i, matrix);
    }
    this.nodeMesh.instanceMatrix.needsUpdate = true;

    const lines = this.scene.children.find(o => (o as any).isLineSegments) as THREE.LineSegments;
    if (lines) {
      const posAttr = lines.geometry.getAttribute('position') as THREE.BufferAttribute;
      const connections: number[] = (lines as any).userData.connections;
      for (let i = 0; i < connections.length; i += 2) {
        const a = this.nodes[connections[i]].position;
        const b = this.nodes[connections[i + 1]].position;
        posAttr.setXYZ(i, a.x, a.y, a.z);
        posAttr.setXYZ(i + 1, b.x, b.y, b.z);
      }
      posAttr.needsUpdate = true;
    }
  }

  private updateParticles() {
    const posAttr = this.particleGeom.getAttribute('position') as THREE.BufferAttribute;
    const velAttr = this.particleGeom.getAttribute('velocity') as THREE.BufferAttribute;
    for (let i = 0; i < posAttr.count; i++) {
      let x = posAttr.getX(i) + velAttr.getX(i);
      let y = posAttr.getY(i) + velAttr.getY(i);
      let z = posAttr.getZ(i) + velAttr.getZ(i);
      if (x > 20 || x < -20) {
        velAttr.setX(i, -velAttr.getX(i));
      }
      if (y > 20 || y < -20) {
        velAttr.setY(i, -velAttr.getY(i));
      }
      if (z > 20 || z < -20) {
        velAttr.setZ(i, -velAttr.getZ(i));
      }
      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  }

  private animate = () => {
    this.updateNodes();
    this.updateParticles();
    this.controls.update();
    this.composer.render();
    this.frameId = requestAnimationFrame(this.animate);
  }

  // Placeholder for backend-driven updates via WebSocket or REST
  updateFromBackend(data: any) {
    // Process incoming data and update nodes/particles
    // Example: data could contain node positions or connection info
  }

}
