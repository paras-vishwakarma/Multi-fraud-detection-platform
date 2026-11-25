import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroShield() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 280;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xe6f9fc, 1.2);
    dirLight.position.set(4, 5, 5);
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 1.5, 10);
    cyanLight.position.set(-3, -1, 3);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x0891b2, 1.0, 10);
    blueLight.position.set(3, 2, -1);
    scene.add(blueLight);

    // Group
    const group = new THREE.Group();
    scene.add(group);

    // ── Minimal Shield Geometry ──
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.5);
    shieldShape.quadraticCurveTo(1.15, 1.3, 1.25, 0.5);
    shieldShape.quadraticCurveTo(1.15, -0.4, 0, -1.45);
    shieldShape.quadraticCurveTo(-1.15, -0.4, -1.25, 0.5);
    shieldShape.quadraticCurveTo(-1.15, 1.3, 0, 1.5);

    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 4,
    };

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.65,
      transparent: true,
      opacity: 0.94,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.position.z = -0.1;
    group.add(shieldMesh);

    // Inner glowing core
    const coreGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(1.95, 0.012, 16, 80);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.7;
    group.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.3, 0.01, 16, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.3;
    ring2.rotation.y = 0.4;
    group.add(ring2);

    // Floating Network Particle Nodes
    const nodeCount = 20;
    const nodePos = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const r = 1.7 + (Math.random() - 0.5) * 0.7;
      nodePos[i * 3] = Math.cos(angle) * r;
      nodePos[i * 3 + 1] = Math.sin(angle) * r * 0.75;
      nodePos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
    const nodeMat = new THREE.PointsMaterial({
      size: 0.065,
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.85,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    group.add(nodes);

    // Subtle interactive mouse rotation
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      shieldMesh.rotation.y = Math.sin(elapsed * 0.5) * 0.18 + mouseX * 0.15;
      shieldMesh.rotation.x = Math.sin(elapsed * 0.35) * 0.08 - mouseY * 0.1;
      shieldMesh.position.y = Math.sin(elapsed * 1.2) * 0.06;

      ring1.rotation.z = elapsed * 0.25;
      ring2.rotation.z = -elapsed * 0.18;
      nodes.rotation.y = elapsed * 0.12;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      shieldGeo.dispose();
      shieldMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
    };
  }, []);

  return (
    <div className="relative flex h-[290px] w-full items-center justify-center">
      {/* Native WebGL Canvas Container */}
      <div ref={mountRef} className="h-full w-full" />
    </div>
  );
}
