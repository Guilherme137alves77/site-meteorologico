import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

function Cloud({ position, scale, speed, dark }) {
  const group = useRef();
  const initialX = position[0];

  useFrame(({ clock }) => {
    if (!group.current) return;
    // Move clouds along X; wind factor is baked into speed for real-data response.
    const t = clock.getElapsedTime() * speed;
    const range = 24;
    const x = (((initialX + t) + range / 2) % range) - range / 2;
    group.current.position.x = x;
  });

  const color = dark ? '#7b8798' : '#ffffff';

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Clouds are simple merged spheres, cheap and stylized. */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[0.9, 0.2, -0.1]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[-0.85, 0.15, 0.1]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[0.2, 0.55, 0]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
    </group>
  );
}

function createClouds(count, wind) {
  // Randomized once per config to keep layout stable across renders.
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    position: [(Math.random() - 0.5) * 22, 2.2 + Math.random() * 3.2, -2 - Math.random() * 8],
    scale: 0.6 + Math.random() * 1.1,
    speed: (0.12 + Math.random() * 0.22) * wind,
  }));
}

export default function Clouds({ count = 10, dark = false, wind = 1 }) {
  // Recreate cloud field when count/wind changes (new weather).
  const [config, setConfig] = useState({ count, wind, clouds: createClouds(count, wind) }); // oxlint-disable-line react/purity
  if (config.count !== count || config.wind !== wind) {
    setConfig({ count, wind, clouds: createClouds(count, wind) });
  }

  return (
    <group>
      {config.clouds.map((c) => (
        <Cloud key={c.id} {...c} dark={dark} />
      ))}
    </group>
  );
}
