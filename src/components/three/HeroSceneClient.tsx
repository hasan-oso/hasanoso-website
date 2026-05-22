'use client';

import dynamic from 'next/dynamic';
import { HeroFallback } from './HeroFallback';

/**
 * `HeroScene` pulls in @react-three/* which is heavy and uses browser globals.
 * Loading it via `dynamic({ ssr: false })` keeps the static export valid and
 * shows the SVG fallback during chunk load.
 */
export const HeroSceneClient = dynamic(
  () => import('./HeroScene').then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  },
);
