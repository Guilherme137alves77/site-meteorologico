import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Moon() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Gentle bob for a living sky.
    ref.current.position.y = 4.2 + Math.sin(clock.getElapsedTime() * 0.25) * 0.1;
  });

  return (
    <group ref={ref} position={[4.2, 4.2, -7]}>
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial color="#e8eeff" emissive="#c7d7ff" emissiveIntensity={1.4} roughness={0.9} />
      </mesh>
      <pointLight intensity={8} distance={25} color="#c7d7ff" />
    </group>
  );
}
