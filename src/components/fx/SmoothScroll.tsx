'use client';

import { useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsDesktop } from '@/hooks/useMediaQuery';

/**
 * Mounts Lenis for premium-feeling momentum scrolling.
 *
 * - Lazy-imports Lenis so the lib only ships when the page actually mounts
 *   it (i.e. not on mobile / reduced-motion).
 * - Cleans up its RAF loop and DOM hooks on unmount.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (reduce || !isDesktop) return;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    let cancelled = false;

    (async () => {
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
      });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [reduce, isDesktop]);

  return null;
}
