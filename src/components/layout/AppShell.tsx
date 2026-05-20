'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { SmoothScroll } from '@/components/effects/SmoothScroll';
import { TIMING } from '@/lib/animations';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: TIMING.base, ease: TIMING.premium }}
    >
      <SmoothScroll>{children}</SmoothScroll>
    </MotionConfig>
  );
}
