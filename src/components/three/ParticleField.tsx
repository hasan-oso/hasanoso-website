'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ambient particle dust. ~600 points scattered in a thick volume around the
 * camera, gently drifting upward to suggest movement without distracting.
 * Color is brand-gold to keep the palette tight.
 */
export function ParticleField({
  count = 600,
  spread = 18,
  color = '#C9A961',
}: {
  count?: number;
  spread?: number;
  color?: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      velocities[i] = 0.02 + Math.random() * 0.05;
    }
    return { positions, velocities };
  }, [count, spread]);

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const geom = pts.geometry as THREE.BufferGeometry;
    const attr = geom.attributes.position as THREE.BufferAttribute | undefined;
    if (!attr) return;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const yIdx = i * 3 + 1;
      const v = velocities[i] ?? 0.03;
      const y = arr[yIdx] ?? 0;
      let next = y + v * delta;
      if (next > spread / 2) next = -spread / 2;
      arr[yIdx] = next;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={color}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
