'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Subtle "lights coming up" fade on first paint. Without this the dark
 * page slams in. Reduced-motion users see it instantly.
 */
export function PageFadeIn() {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // schedule on next frame so the initial paint catches the opacity:0 state
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050810',
        opacity: mounted ? 0 : 1,
        pointerEvents: 'none',
        zIndex: 9000,
        transition: 'opacity 600ms cubic-bezier(0.16,1,0.3,1)',
      }}
    />
  );
}
