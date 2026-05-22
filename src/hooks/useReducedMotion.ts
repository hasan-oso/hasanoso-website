'use client';

import { useEffect, useState } from 'react';

/**
 * Subscribes to `prefers-reduced-motion: reduce`.
 * Returns `true` when the user has requested reduced motion or while we
 * haven't hydrated yet (SSR-safe default = no motion).
 */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduce;
}
