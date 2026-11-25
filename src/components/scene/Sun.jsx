import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Sun() {
  const ref = useRef();

  // useFrame runs every render frame (~60fps), perfect for small continuous animations.
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = 3.8 + Math.sin(t * 0.4) * 0.15;
    ref.current.rotation.y += 0.002;
  });

  return (
    <group ref={ref} position={[4.5, 3.8, -6]}>
      {/* emissive makes the sphere look like it emits light. */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial emissive="#ffd36a" emissiveIntensity={2.2} color="#ffdf85" />
      </mesh>
      <pointLight intensity={25} distance={30} color="#ffdca0" />
    </group>
  );
}
