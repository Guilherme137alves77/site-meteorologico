import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function createStarPositions(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Distribute stars on a far dome behind the scene.
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = 18 + Math.random() * 8;
    const idx = i * 3;
    arr[idx] = r * Math.sin(phi) * Math.cos(theta);
    arr[idx + 1] = Math.abs(r * Math.cos(phi)) * 0.7 + 0.5;
    arr[idx + 2] = -Math.abs(r * Math.sin(phi) * Math.sin(theta)) - 4;
  }
  return arr;
}

export default function Stars({ count = 200 }) {
  const ref = useRef();
  const positions = useMemo(() => createStarPositions(count), [count]); // oxlint-disable-line react/purity

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Very slow rotation gives life without distracting the UI.
    ref.current.rotation.y = clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.06} sizeAttenuation transparent opacity={0.95} />
    </points>
  );
}
