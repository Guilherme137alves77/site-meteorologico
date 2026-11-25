import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function createFlakes(count, wind) {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 24,
    y: Math.random() * 14 - 2,
    z: -1 - Math.random() * 12,
    speed: 0.5 + Math.random() * 1.1,
    drift: Math.random() * Math.PI * 2,
    sway: 0.15 + wind * 0.12,
  }));
}

export default function Snow({ count = 450, wind = 1 }) {
  const mesh = useRef();
  const flakes = useMemo(() => createFlakes(count, wind), [count, wind]); // oxlint-disable-line react/purity

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y -= f.speed * delta; // oxlint-disable-line react/immutability
      // Drift amplitude responds to wind speed.
      const x = f.x + Math.sin(t * 0.5 + f.drift) * f.sway;
      if (f.y < -4) {
        f.y = 8 + Math.random() * 4; // oxlint-disable-line react/immutability
        f.x = (Math.random() - 0.5) * 24; // oxlint-disable-line react/immutability
      }
      const idx = i * 3;
      positions[idx] = x;
      positions[idx + 1] = f.y;
      positions[idx + 2] = f.z;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      const idx = i * 3;
      arr[idx] = f.x; arr[idx + 1] = f.y; arr[idx + 2] = f.z;
    }
    return arr;
  }, [count, flakes]);

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.08} transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}
