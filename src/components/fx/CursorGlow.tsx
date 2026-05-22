'use client';

import { useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsDesktop } from '@/hooks/useMediaQuery';

/**
 * Tracks the pointer and writes its position into the `--cursor-x` /
 * `--cursor-y` CSS vars. The actual glow is drawn by the `body::before`
 * gradient in globals.css.
 *
 * Skipped entirely on touch / mobile / reduced-motion.
 */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (reduce || !isDesktop) return;
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    let raf = 0;
    let nextX = -1000;
    let nextY = -1000;

    function onMove(e: PointerEvent) {
      // body::before is 600x600 so we centre by subtracting 300
      nextX = e.clientX - 300;
      nextY = e.clientY - 300;
      if (!raf) {
        raf = requestAnimationFrame(flush);
      }
    }
    function flush() {
      raf = 0;
      root.style.setProperty('--cursor-x', `${nextX}px`);
      root.style.setProperty('--cursor-y', `${nextY}px`);
    }
    function onLeave() {
      root.style.setProperty('--cursor-x', `-1000px`);
      root.style.setProperty('--cursor-y', `-1000px`);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce, isDesktop]);

  return null;
}
