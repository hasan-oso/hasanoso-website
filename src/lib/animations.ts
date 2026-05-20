import type { Variants, Transition } from 'framer-motion';

export const TIMING = {
  instant: 0.15,
  fast: 0.3,
  base: 0.5,
  slow: 0.8,
  slower: 1.2,

  smooth: [0.25, 0.1, 0.25, 1] as const,
  premium: [0.16, 1, 0.3, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,

  staggerFast: 0.04,
  staggerBase: 0.08,
  staggerSlow: 0.12,
} as const;

const premiumEase = [...TIMING.premium];
const smoothEase = [...TIMING.smooth];

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.slow, ease: premiumEase } satisfies Transition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: smoothEase } satisfies Transition,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: TIMING.slow, ease: premiumEase } satisfies Transition,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: TIMING.slow, ease: premiumEase } satisfies Transition,
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: TIMING.staggerBase,
      delayChildren: 0.1,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: TIMING.base, ease: premiumEase } satisfies Transition,
  },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: premiumEase } satisfies Transition,
  },
};

export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

export const heroItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: premiumEase } satisfies Transition,
  },
};

export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 } satisfies Transition,
  },
};
