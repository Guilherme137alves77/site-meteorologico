import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function createDrops(count, wind) {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 24,
    y: Math.random() * 14 - 2,
    z: -1 - Math.random() * 12,
    speed: (6 + Math.random() * 6) * (0.8 + wind * 0.2),
    len: 0.12 + Math.random() * 0.18,
    drift: (Math.random() - 0.5) * 0.3 * wind,
  }));
}

export default function Rain({ count = 600, wind = 1 }) {
  const mesh = useRef();
  const drops = useMemo(() => createDrops(count, wind), [count, wind]); // oxlint-disable-line react/purity

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      d.y -= d.speed * delta; // oxlint-disable-line react/immutability
      d.x += d.drift * delta; // oxlint-disable-line react/immutability
      if (d.y < -4) {
        d.y = 8 + Math.random() * 4; // oxlint-disable-line react/immutability
        d.x = (Math.random() - 0.5) * 24; // oxlint-disable-line react/immutability
      }
      const idx = i * 6;
      // Each drop is a line segment (2 vertices = 6 floats).
      positions[idx] = d.x;
      positions[idx + 1] = d.y;
      positions[idx + 2] = d.z;
      positions[idx + 3] = d.x + d.drift * 0.02;
      positions[idx + 4] = d.y - d.len;
      positions[idx + 5] = d.z;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 6);
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      const idx = i * 6;
      arr[idx] = d.x; arr[idx + 1] = d.y; arr[idx + 2] = d.z;
      arr[idx + 3] = d.x; arr[idx + 4] = d.y - d.len; arr[idx + 5] = d.z;
    }
    return arr;
  }, [count, drops]);

  return (
    <lineSegments ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#b7d7ff" transparent opacity={0.65} />
    </lineSegments>
  );
}
