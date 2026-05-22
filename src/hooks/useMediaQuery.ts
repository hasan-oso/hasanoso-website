'use client';

import { useEffect, useState } from 'react';

/**
 * Generic `matchMedia` hook.
 * Defaults to `false` on the server so the conservative branch (no 3D,
 * smallest layout) renders first and we never hydrate-mismatch.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True when the viewport is >= md (768px). */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}
