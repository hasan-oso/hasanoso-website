'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CARD_W = 3.5;
const CARD_H = 2.05;
const CARD_D = 0.05;

/**
 * Paints the card front into an offscreen canvas, then wraps it in a Three
 * texture. Doing it at runtime (vs shipping a PNG) keeps the visual editable
 * via CSS-like calls and ships zero assets.
 */
function useCardFrontTexture(): THREE.CanvasTexture | null {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    const W = 1024;
    const H = Math.round((CARD_H / CARD_W) * W);
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Base: deep navy gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#1A2238');
    grad.addColorStop(0.55, '#0F1626');
    grad.addColorStop(1, '#0A0F1C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle PCB lattice
    ctx.strokeStyle = 'rgba(201,169,97,0.08)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = step; x < W; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = step; y < H; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Chip
    const chipX = 90;
    const chipY = H / 2 - 90;
    const chipSize = 180;

    // chip glow
    const chipGlow = ctx.createRadialGradient(
      chipX + chipSize / 2,
      chipY + chipSize / 2,
      0,
      chipX + chipSize / 2,
      chipY + chipSize / 2,
      chipSize,
    );
    chipGlow.addColorStop(0, 'rgba(232,199,110,0.45)');
    chipGlow.addColorStop(1, 'rgba(232,199,110,0)');
    ctx.fillStyle = chipGlow;
    ctx.fillRect(
      chipX - chipSize / 2,
      chipY - chipSize / 2,
      chipSize * 2,
      chipSize * 2,
    );

    // chip outer
    ctx.strokeStyle = '#C9A961';
    ctx.lineWidth = 3;
    roundRect(ctx, chipX, chipY, chipSize, chipSize, 14);
    ctx.stroke();
    // chip inner detail
    ctx.strokeStyle = 'rgba(201,169,97,0.5)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, chipX + 24, chipY + 24, chipSize - 48, chipSize - 48, 8);
    ctx.stroke();
    // chip cross
    ctx.beginPath();
    ctx.moveTo(chipX + chipSize / 2, chipY + 24);
    ctx.lineTo(chipX + chipSize / 2, chipY + chipSize - 24);
    ctx.moveTo(chipX + 24, chipY + chipSize / 2);
    ctx.lineTo(chipX + chipSize - 24, chipY + chipSize / 2);
    ctx.strokeStyle = 'rgba(201,169,97,0.35)';
    ctx.stroke();

    // chip pads
    ctx.strokeStyle = '#C9A961';
    ctx.lineWidth = 2;
    const padCount = 6;
    const padGap = chipSize / (padCount + 1);
    for (let i = 1; i <= padCount; i++) {
      // top
      ctx.beginPath();
      ctx.moveTo(chipX + i * padGap, chipY);
      ctx.lineTo(chipX + i * padGap, chipY - 16);
      ctx.stroke();
      // bottom
      ctx.beginPath();
      ctx.moveTo(chipX + i * padGap, chipY + chipSize);
      ctx.lineTo(chipX + i * padGap, chipY + chipSize + 16);
      ctx.stroke();
      // left
      ctx.beginPath();
      ctx.moveTo(chipX, chipY + i * padGap);
      ctx.lineTo(chipX - 16, chipY + i * padGap);
      ctx.stroke();
      // right
      ctx.beginPath();
      ctx.moveTo(chipX + chipSize, chipY + i * padGap);
      ctx.lineTo(chipX + chipSize + 16, chipY + i * padGap);
      ctx.stroke();
    }

    // Wordmark
    ctx.fillStyle = '#E8E4D9';
    ctx.font = '300 86px "Cormorant Garamond", Georgia, serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('Hasan Oso', 340, H / 2 - 28);

    // Subtitle
    ctx.fillStyle = '#C9A961';
    ctx.font = '300 22px "Geist Mono", ui-monospace, monospace';
    ctx.letterSpacing = '6px';
    ctx.fillText('A I   E N G I N E E R', 342, H / 2 + 30);

    // Divider
    ctx.fillStyle = '#C9A961';
    ctx.fillRect(342, H / 2 + 56, 48, 1);

    // URL
    ctx.fillStyle = '#7E8AA0';
    ctx.font = '300 18px "Geist Mono", ui-monospace, monospace';
    ctx.fillText('hasanoso.com', 342, H / 2 + 80);

    // Gold edge highlight
    ctx.strokeStyle = 'rgba(232,199,110,0.6)';
    ctx.lineWidth = 2;
    roundRect(ctx, 4, 4, W - 8, H - 8, 28);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * The floating business card. Box geometry so the edges catch the gold
 * lights; the front face uses a canvas-painted texture, the back is a
 * darker version of the same navy gradient.
 *
 * Idle motion: gentle bob + slow yaw. When `motion === false`, the card
 * sits perfectly still — useful behind a non-3D fallback path that still
 * mounts the Canvas.
 */
export function BusinessCard3D({
  motion = true,
}: {
  motion?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const front = useCardFrontTexture();

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    if (!motion) return;
    const t = state.clock.getElapsedTime();
    g.position.y = Math.sin(t * 0.45) * 0.12;
    g.rotation.y = Math.sin(t * 0.25) * 0.18;
    g.rotation.x = Math.sin(t * 0.18) * 0.06;
  });

  return (
    <group ref={groupRef} rotation={[0.08, -0.18, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[CARD_W, CARD_H, CARD_D]} />
        {/* front (+Z) */}
        <meshStandardMaterial
          attach="material-4"
          map={front ?? undefined}
          metalness={0.25}
          roughness={0.35}
          emissive="#1A2238"
          emissiveIntensity={0.08}
        />
        {/* back (-Z) */}
        <meshStandardMaterial
          attach="material-5"
          color="#0A0F1C"
          metalness={0.4}
          roughness={0.6}
        />
        {/* edges (+X, -X, +Y, -Y) */}
        {[0, 1, 2, 3].map((idx) => (
          <meshStandardMaterial
            key={idx}
            attach={`material-${idx}`}
            color="#C9A961"
            metalness={0.85}
            roughness={0.18}
          />
        ))}
      </mesh>

      {/* subtle floor reflection for grounding */}
      <mesh position={[0, -CARD_H * 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CARD_W * 1.6, 1.5]} />
        <meshBasicMaterial color="#C9A961" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}
