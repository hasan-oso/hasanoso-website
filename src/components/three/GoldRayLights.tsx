'use client';

/**
 * Scene lighting rig: warm gold key + cool neon rim + low ambient fill.
 * Pure declarative lights — no animation, so it's cheap on every frame.
 */
export function GoldRayLights() {
  return (
    <>
      {/* warm gold key from upper-right */}
      <directionalLight
        position={[4, 5, 3]}
        intensity={1.4}
        color="#E8C76E"
      />
      {/* secondary gold fill below */}
      <directionalLight
        position={[-2, -3, 2]}
        intensity={0.4}
        color="#C9A961"
      />
      {/* cyan neon rim from the left, pure brand accent */}
      <directionalLight
        position={[-5, 1, -2]}
        intensity={0.6}
        color="#00E5FF"
      />
      {/* ambient floor so nothing goes pitch-black */}
      <ambientLight intensity={0.18} color="#1A2238" />
      {/* point light to bloom the chip */}
      <pointLight
        position={[-1.2, 0.4, 1.4]}
        intensity={1.2}
        color="#E8C76E"
        distance={4}
        decay={2}
      />
    </>
  );
}
