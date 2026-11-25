import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useEffect, useRef } from 'react';
import { BRAZIL_BOUNDS } from '../../utils/brazilBounds';

const SKY = { position: new Vector3(0, 1.5, 10), target: new Vector3(0, 1.2, 0) };

function getMapPreset(camera) {
  // Frame Brazil from its bounding box with 10% margin on all sides.
  const margin = 1.1;
  const aspect = camera.aspect || 1;
  const fov = (camera.fov * Math.PI) / 180;
  const height = BRAZIL_BOUNDS.height * margin;
  const width = BRAZIL_BOUNDS.width * margin;
  // Fit both dimensions: distance needed for height and for width.
  const distH = height / (2 * Math.tan(fov / 2));
  const distW = width / (2 * Math.tan(fov / 2) * aspect);
  const distance = Math.max(distH, distW);

  const target = new Vector3(BRAZIL_BOUNDS.centerX, 0, BRAZIL_BOUNDS.centerZ);
  const position = new Vector3(BRAZIL_BOUNDS.centerX, distance, BRAZIL_BOUNDS.centerZ + distance * 0.35);
  return { position, target };
}

export default function CameraRig({ view }) {
  const { camera, size } = useThree();
  const mapPreset = getMapPreset(camera);
  const currentPos = useRef((view === 'sky' ? SKY.position : mapPreset.position).clone());
  const currentTarget = useRef((view === 'sky' ? SKY.target : mapPreset.target).clone());
  const desired = useRef(view === 'sky' ? SKY : mapPreset);

  useEffect(() => {
    desired.current = view === 'sky' ? SKY : getMapPreset(camera);
  }, [view, camera, size.width, size.height]);

  // Lerp camera each frame for smooth, frame-rate independent transitions.
  useFrame((_, delta) => {
    const d = desired.current;
    const alpha = 1 - Math.exp(-delta * 2.6);
    currentPos.current.lerp(d.position, alpha);
    currentTarget.current.lerp(d.target, alpha);
    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
