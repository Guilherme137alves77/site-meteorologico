// Maps WMO weather codes to a simplified scene mode used by UI and 3D.
export const WEATHER_MODES = {
  CLEAR: 'clear',
  CLOUDY: 'cloudy',
  RAIN: 'rain',
  SNOW: 'snow',
  STORM: 'storm',
  NIGHT_CLEAR: 'night-clear',
};

const CODE_LABELS = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Nevoeiro',
  48: 'Nevoeiro com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa intensa',
  56: 'Garoa congelante leve',
  57: 'Garoa congelante intensa',
  61: 'Chuva fraca',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva congelante leve',
  67: 'Chuva congelante forte',
  71: 'Neve fraca',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva fracas',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva fortes',
  85: 'Pancadas de neve fracas',
  86: 'Pancadas de neve fortes',
  95: 'Tempestade',
  96: 'Tempestade com granizo',
  99: 'Tempestade forte com granizo',
};

export function getWeatherLabel(code) {
  return CODE_LABELS[code] ?? 'Condição desconhecida';
}

export function getDayPhase(time, isDay = 1) {
  // Derive phase from local hour in API time (ISO, timezone already applied by Open-Meteo).
  const raw = String(time || '');
  const h = parseInt(raw.slice(11, 13), 10);
  const hour = Number.isFinite(h) ? h : new Date().getHours();

  if (isDay === 0) return 'night';
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 16) return 'day';
  if (hour >= 16 && hour < 19) return 'dusk';
  return 'night';
}

// Scene selection logic: WMO code picks condition, isDay/time pick day phase.
// cloudCover and windSpeed are passed to scene components to tune intensity.
export function getSkyConfig({ code, isDay = 1, cloudCover = 0, windSpeed = 0, time }) {
  const night = isDay === 0;
  let mode = WEATHER_MODES.CLOUDY;

  if (code === 0 || code === 1) mode = night ? WEATHER_MODES.NIGHT_CLEAR : WEATHER_MODES.CLEAR;
  else if (code === 2 || code === 3 || code === 45 || code === 48) mode = WEATHER_MODES.CLOUDY;
  else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) mode = WEATHER_MODES.RAIN;
  else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) mode = WEATHER_MODES.SNOW;
  else if (code >= 95) mode = WEATHER_MODES.STORM;
  else mode = night ? WEATHER_MODES.NIGHT_CLEAR : WEATHER_MODES.CLOUDY;

  return {
    mode,
    night,
    dayPhase: getDayPhase(time, isDay),
    cloudCover: Math.max(0, Math.min(100, Number(cloudCover) || 0)),
    windSpeed: Math.max(0, Number(windSpeed) || 0),
  };
}

export function getWeatherMode(code, isDay = 1) {
  const night = isDay === 0;

  if (code === 0 || code === 1) {
    return night ? WEATHER_MODES.NIGHT_CLEAR : WEATHER_MODES.CLEAR;
  }
  if (code === 2 || code === 3 || code === 45 || code === 48) {
    return WEATHER_MODES.CLOUDY;
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return WEATHER_MODES.RAIN;
  }
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return WEATHER_MODES.SNOW;
  }
  if (code >= 95) {
    return WEATHER_MODES.STORM;
  }

  return night ? WEATHER_MODES.NIGHT_CLEAR : WEATHER_MODES.CLOUDY;
}
