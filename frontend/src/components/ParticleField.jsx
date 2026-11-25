import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 60 }) {
  const mesh = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return arr;
  }, [count]);

  const speeds = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.002,
      y: (Math.random() - 0.5) * 0.002,
      z: (Math.random() - 0.5) * 0.001,
    }));
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3]     += speeds[i].x;
      pos[i * 3 + 1] += speeds[i].y;
      pos[i * 3 + 2] += speeds[i].z;
      if (Math.abs(pos[i * 3])     > 15) speeds[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 10) speeds[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 7.5) speeds[i].z *= -1;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#D97706"
        transparent
        opacity={0.2}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function NetworkLines({ count = 15 }) {
  const linePositions = useMemo(() => {
    const arr = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      arr[i * 6]     = (Math.random() - 0.5) * 20;
      arr[i * 6 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 6 + 2] = (Math.random() - 0.5) * 10;
      arr[i * 6 + 3] = arr[i * 6]     + (Math.random() - 0.5) * 4;
      arr[i * 6 + 4] = arr[i * 6 + 1] + (Math.random() - 0.5) * 4;
      arr[i * 6 + 5] = arr[i * 6 + 2] + (Math.random() - 0.5) * 2;
    }
    return arr;
  }, [count]);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
          count={count * 2}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#F59E0B"
        transparent
        opacity={0.06}
        depthWrite={false}
      />
    </lineSegments>
  );
}

export default function ParticleField() {
  return (
    <div className="three-canvas pointer-events-none fixed inset-0 z-0 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
      >
        <Particles />
        <NetworkLines />
      </Canvas>
    </div>
  );
}
