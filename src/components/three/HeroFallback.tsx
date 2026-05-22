'use client';

/**
 * Static SVG hero shown to:
 *   - users with `prefers-reduced-motion: reduce`
 *   - users on small viewports (we keep 3D desktop-only by default)
 *   - the SSR pass / pre-hydration paint
 *
 * Mirrors the 3D scene: dark void with a soft gold vignette, scattered
 * gold "dust" particles, and a single thin neon ray.
 * (No card mesh — the user removed it from the 3D version too.)
 */
export function HeroFallback() {
  // Pseudo-random but deterministic dust so server + client agree on render
  // and we don't trip hydration warnings.
  const dust = [
    [120, 80, 1.4],
    [680, 120, 1.0],
    [240, 510, 1.6],
    [600, 480, 1.2],
    [400, 60, 1.0],
    [60, 300, 1.4],
    [740, 320, 1.0],
    [380, 540, 1.2],
    [200, 200, 0.8],
    [560, 200, 1.1],
    [320, 380, 0.9],
    [480, 80, 1.0],
    [160, 460, 1.3],
    [640, 360, 0.9],
    [700, 540, 1.2],
    [80, 540, 1.0],
    [440, 280, 0.8],
    [520, 540, 1.0],
    [280, 140, 1.1],
    [720, 240, 0.8],
  ] as const;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      aria-hidden="true"
      data-hero-fallback=""
    >
      {/* radial gold vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(201,169,97,0.12) 0%, rgba(10,15,28,0) 60%)',
        }}
      />

      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        {dust.map(([cx, cy, r], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="#E8C76E"
            opacity={0.35}
          />
        ))}

        {/* a single quiet neon ray */}
        <line
          x1="100"
          y1="540"
          x2="700"
          y2="60"
          stroke="#00E5FF"
          strokeOpacity="0.18"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
