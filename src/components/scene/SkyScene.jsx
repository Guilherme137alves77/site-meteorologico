import { WEATHER_MODES } from '../../utils/weatherCodes';
import Atmosphere from './Atmosphere';
import Clouds from './Clouds';
import Lightning from './Lightning';
import Moon from './Moon';
import Rain from './Rain';
import Snow from './Snow';
import Stars from './Stars';
import Sun from './Sun';

const PHASE_LIGHT = {
  dawn: { ambient: 0.5, sun: 1.1, sunColor: '#ffcc99' },
  day: { ambient: 0.65, sun: 1.45, sunColor: '#fff3d4' },
  dusk: { ambient: 0.42, sun: 0.95, sunColor: '#ffb07a' },
  night: { ambient: 0.32, sun: 0.28, sunColor: '#9eb2ff' },
};

export default function SkyScene({ sky }) {
  const { mode, night, cloudCover, windSpeed, dayPhase = 'day' } = sky;
  const cloudy = mode !== WEATHER_MODES.CLEAR && mode !== WEATHER_MODES.NIGHT_CLEAR;
  const rainy = mode === WEATHER_MODES.RAIN || mode === WEATHER_MODES.STORM;
  const snowy = mode === WEATHER_MODES.SNOW;
  const stormy = mode === WEATHER_MODES.STORM;
  const clear = mode === WEATHER_MODES.CLEAR || mode === WEATHER_MODES.NIGHT_CLEAR;

  // Real API data drives scene intensity: cloud cover -> cloud count, wind -> motion.
  const cloudCount = Math.round(4 + (cloudCover / 100) * 14) + (stormy ? 4 : 0);
  const rainCount = Math.round(350 + (cloudCover / 100) * 700) + (stormy ? 250 : 0);
  const windFactor = 0.6 + Math.min(windSpeed, 60) / 30;
  const light = PHASE_LIGHT[night ? 'night' : dayPhase] || PHASE_LIGHT.day;

  return (
    <>
      {/* Atmosphere sets sky color/fog; lights react to day phase, weather and clouds. */}
      <Atmosphere mode={mode} night={night} cloudCover={cloudCover} dayPhase={dayPhase} />
      <ambientLight intensity={light.ambient - (cloudCover / 100) * 0.1} />
      <directionalLight
        position={[6, 8, 4]}
        intensity={light.sun - (cloudCover / 100) * 0.35}
        color={light.sunColor}
      />

      {clear && !night && <Sun />}
      {clear && night && <Moon />}
      {night && <Stars count={cloudCover > 60 ? 90 : 220} />}
      {cloudy && <Clouds count={cloudCount} dark={stormy || night} wind={windFactor} />}
      {rainy && <Rain count={rainCount} wind={windFactor} />}
      {snowy && <Snow count={Math.round(300 + (cloudCover / 100) * 350)} wind={windFactor} />}
      {stormy && <Lightning />}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={night ? '#0b1020' : stormy ? '#3a4152' : '#6e8ba8'} roughness={1} />
      </mesh>
    </>
  );
}
