import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Lightning() {
  const light = useRef();
  const [flash, setFlash] = useState(0);
  const timer = useRef(0);
  // Randomized initial delay; stored in ref so it persists across renders.
  const next = useRef(1.5 + Math.random() * 3); // oxlint-disable-line react/purity

  useFrame((_, delta) => {
    timer.current += delta;
    if (flash > 0) {
      // Decay the flash quickly to mimic a lightning strike.
      const nextFlash = Math.max(0, flash - delta * 8);
      setFlash(nextFlash);
      if (light.current) light.current.intensity = nextFlash * 30;
      return;
    }

    if (timer.current > next.current) {
      timer.current = 0;
      next.current = 1.8 + Math.random() * 4.5;
      setFlash(1);
      if (light.current) {
        light.current.position.set((Math.random() - 0.5) * 6, 4 + Math.random() * 2, -3 - Math.random() * 4);
      }
    }
  });

  return (
    <>
      <pointLight ref={light} intensity={0} color="#dbe9ff" distance={40} />
      {/* Subtle screen-wide flash via a big translucent plane in front of camera. */}
      <mesh position={[0, 1, 4]}>
        <planeGeometry args={[30, 20]} />
        <meshBasicMaterial color="#dcecff" transparent opacity={flash * 0.12} depthWrite={false} />
      </mesh>
    </>
  );
}
