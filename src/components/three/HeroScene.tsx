'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import { ParticleField } from './ParticleField';
import { GoldRayLights } from './GoldRayLights';
import { HeroFallback } from './HeroFallback';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsDesktop } from '@/hooks/useMediaQuery';

/**
 * Top-level 3D hero — particle field + brand lighting + post-processing.
 * The business-card mesh was removed at the user's request; the moving
 * particle "wave" stays as the headline visual.
 *
 * Renders the static SVG fallback unless:
 *   - viewport >= md (avoid hammering mobile GPUs by default)
 *   - prefers-reduced-motion is OFF
 *
 * `powerPreference: 'high-performance'` so dual-GPU laptops pick the
 * discrete card.
 */
export function HeroScene() {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  // Conservative branch — small viewport OR reduced motion preference
  if (!isDesktop || reduce) {
    return <HeroFallback />;
  }

  return (
    <div className="absolute inset-0" data-hero-3d="">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.2, 5.2], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <color attach="background" args={['#0A0F1C']} />
        <fog attach="fog" args={['#0A0F1C', 7, 16]} />

        <Suspense fallback={null}>
          <GoldRayLights />
          {/* Denser cloud now that the card is gone — fills the frame
              and gives the particles a more "wave" feel. */}
          <ParticleField count={1100} spread={22} />

          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.85}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              radialModulation
              modulationOffset={0.4}
              offset={new THREE.Vector2(0.0009, 0.0009)}
            />
            <Vignette eskil={false} offset={0.25} darkness={0.9} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
