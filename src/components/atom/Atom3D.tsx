import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface Atom3DProps {
  protons: number;
  neutrons: number;
  electrons: number;
  speed: number;
}

function Nucleus({ protons, neutrons }: { protons: number; neutrons: number }) {
  const total = protons + neutrons;
  const positions = useMemo(() => {
    const arr: { pos: [number, number, number]; isProton: boolean }[] = [];
    // Fibonacci sphere distribution
    const n = Math.max(total, 1);
    const radius = 0.35 + Math.cbrt(n) * 0.25;
    let pCount = 0, nCount = 0;
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      // Interleave protons and neutrons for visual mix
      const isProton = pCount / Math.max(protons, 1) <= nCount / Math.max(neutrons, 1) && pCount < protons;
      if (isProton) pCount++; else if (nCount < neutrons) nCount++;
      else { /* fallback */ }
      arr.push({ pos: [x, y, z], isProton });
    }
    return arr;
  }, [protons, neutrons, total]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.2;
  });

  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={p.isProton ? '#ef4444' : '#94a3b8'}
            emissive={p.isProton ? '#7f1d1d' : '#334155'}
            emissiveIntensity={0.4}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function ElectronShell({ shellIndex, count, radius, speed }: { shellIndex: number; count: number; radius: number; speed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const tilt = useMemo(() => ({
    x: (shellIndex * 0.4) % Math.PI,
    z: (shellIndex * 0.7) % Math.PI,
  }), [shellIndex]);

  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * speed * (1 + shellIndex * 0.15);
    }
  });

  // Orbit ring
  const ringPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);

  const ringGeom = useMemo(() => new THREE.BufferGeometry().setFromPoints(ringPoints), [ringPoints]);

  return (
    <group rotation={[tilt.x, 0, tilt.z]}>
      <line>
        <primitive object={ringGeom} attach="geometry" />
        <lineBasicMaterial attach="material" color="#06b6d4" transparent opacity={0.3} />
      </line>
      <group ref={groupRef}>
        {Array.from({ length: count }).map((_, i) => {
          const a = (i / count) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial
                color="#22d3ee"
                emissive="#0891b2"
                emissiveIntensity={1.2}
                roughness={0.2}
                metalness={0.6}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// Bohr-like shell capacities: 2, 8, 18, 32, 32, 18, 8
const SHELL_CAP = [2, 8, 18, 32, 32, 18, 8];
function distributeElectrons(count: number): number[] {
  const shells: number[] = [];
  let remaining = count;
  for (const cap of SHELL_CAP) {
    if (remaining <= 0) break;
    const take = Math.min(cap, remaining);
    shells.push(take);
    remaining -= take;
  }
  return shells;
}

export function Atom3D({ protons, neutrons, electrons, speed }: Atom3DProps) {
  const shells = useMemo(() => distributeElectrons(electrons), [electrons]);

  return (
    <Canvas camera={{ position: [0, 2, 9], fov: 55 }} dpr={[1, 2]}>
      <color attach="background" args={['#0b1220']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#3b82f6" />
      <Stars radius={50} depth={30} count={1500} factor={3} fade speed={0.5} />
      <Nucleus protons={protons} neutrons={neutrons} />
      {shells.map((c, i) => (
        <ElectronShell key={i} shellIndex={i} count={c} radius={1.6 + i * 1.0} speed={speed} />
      ))}
      <OrbitControls enablePan={false} minDistance={4} maxDistance={20} autoRotate autoRotateSpeed={0.3} />
    </Canvas>
  );
}