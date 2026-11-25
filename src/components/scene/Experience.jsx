import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import BrazilMap from '../map/BrazilMap';
import CameraRig from './CameraRig';
import SkyScene from './SkyScene';

function MapLights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 12, 6]} intensity={1.7} color="#ffffff" />
      <directionalLight position={[-6, 4, -4]} intensity={0.45} color="#7fd0ff" />
    </>
  );
}

export default function Experience({ view, selectedState, onSelectState, sky }) {
  // Transition: keep sky mounted briefly during fade-out when returning to map.
  const [showSky, setShowSky] = useState(view === 'sky');
  const [skyVisible, setSkyVisible] = useState(view === 'sky');
  const timer = useRef();

  useEffect(() => {
    clearTimeout(timer.current);
    if (view === 'sky') {
      // Next frame so CSS transition can animate opacity/scale.
      const raf = requestAnimationFrame(() => {
        setShowSky(true);
        requestAnimationFrame(() => setSkyVisible(true));
      });
      return () => {
        clearTimeout(timer.current);
        cancelAnimationFrame(raf);
      };
    }

    const raf = requestAnimationFrame(() => setSkyVisible(false));
    timer.current = setTimeout(() => setShowSky(false), 650);
    return () => {
      clearTimeout(timer.current);
      cancelAnimationFrame(raf);
    };
  }, [view]);

  return (
    <div className="scene-root" aria-hidden="true">
      {/* Base map canvas is always present; sky crossfades over it. */}
      {/* In sky view, map becomes a small interactive selector dock. */}
      <div className={`scene-layer map-layer ${view === 'map' ? 'is-active' : 'is-dock'}`}>
        <Canvas camera={{ position: [0, 9, 12], fov: 38 }} dpr={[1, 2]} resize={{ scroll: false, debounce: 0 }}>
          <Suspense fallback={null}>
            <color attach="background" args={['#060c16']} />
            <fog attach="fog" args={['#060c16', 18, 45]} />
            <MapLights />
            <CameraRig view="map" />
            <BrazilMap selectedId={selectedState?.id} onSelect={onSelectState} />
          </Suspense>
        </Canvas>

      </div>

      {showSky && (
        <div className={`scene-layer sky-layer ${skyVisible ? 'is-active' : ''}`}>
          <Canvas camera={{ position: [0, 1.5, 10], fov: 55 }} dpr={[1, 2]} resize={{ scroll: false, debounce: 0 }}>
            <Suspense fallback={null}>
              <CameraRig view="sky" />
              <SkyScene sky={sky} />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
}
