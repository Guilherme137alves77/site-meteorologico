import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Color, Fog } from 'three';
import { WEATHER_MODES } from '../../utils/weatherCodes';

const BASE = {
  [WEATHER_MODES.CLEAR]: { bg: '#102a52', fog: '#1e3f70' },
  [WEATHER_MODES.CLOUDY]: { bg: '#0f2648', fog: '#1b3963' },
  [WEATHER_MODES.RAIN]: { bg: '#0c2140', fog: '#173458' },
  [WEATHER_MODES.SNOW]: { bg: '#18345a', fog: '#294c78' },
  [WEATHER_MODES.STORM]: { bg: '#081a33', fog: '#122c52' },
  [WEATHER_MODES.NIGHT_CLEAR]: { bg: '#06142b', fog: '#0d2446' },
};

// Time-of-day tint layered over weather palette (kept navy-toned).
const PHASE_TINT = {
  dawn: { bg: '#5a4a72', fog: '#6b5b86', amount: 0.2 },
  day: { bg: '#1a3f73', fog: '#2a568f', amount: 0.12 },
  dusk: { bg: '#4a3d66', fog: '#5e507f', amount: 0.22 },
  night: { bg: '#020814', fog: '#07162a', amount: 0.4 },
};

export default function Atmosphere({ mode, night, cloudCover = 0, dayPhase = 'day' }) {
  const { scene } = useThree();

  useEffect(() => {
    // Blend weather base with day phase (dawn/day/dusk/night) for dynamic sky.
    const base = BASE[mode] || BASE[WEATHER_MODES.CLEAR];
    const phase = PHASE_TINT[night ? 'night' : dayPhase] || PHASE_TINT.day;
    const bg = new Color(base.bg).lerp(new Color(phase.bg), phase.amount);
    const fogColor = new Color(base.fog).lerp(new Color(phase.fog), phase.amount * 0.8);

    // Cloud cover darkens the sky; keep it moody but readable.
    const darken = 0.12 + (cloudCover / 100) * (night ? 0.12 : 0.18);
    bg.multiplyScalar(1 - darken);
    fogColor.multiplyScalar(1 - darken * 0.65);

    scene.background = bg; // oxlint-disable-line react/immutability
    scene.fog = new Fog(fogColor, 8, 28); // oxlint-disable-line react/immutability
  }, [mode, night, cloudCover, dayPhase, scene]);

  return null;
}
