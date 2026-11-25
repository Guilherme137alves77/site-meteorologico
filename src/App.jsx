import { useCallback, useMemo, useState } from 'react';
import Experience from './components/scene/Experience';
import WeatherPanel from './components/ui/WeatherPanel';
import { fetchCurrentWeather } from './services/weatherApi';
import { getSkyConfig, WEATHER_MODES } from './utils/weatherCodes';

// Panel accent follows the selected sky; map view keeps a neutral dark accent.
const PALETTES = {
  [WEATHER_MODES.CLEAR]: { accent: '#7dd3fc', glow: 'rgba(125,211,252,0.22)' },
  [WEATHER_MODES.CLOUDY]: { accent: '#cbd5e1', glow: 'rgba(203,213,225,0.16)' },
  [WEATHER_MODES.RAIN]: { accent: '#93c5fd', glow: 'rgba(147,197,253,0.2)' },
  [WEATHER_MODES.SNOW]: { accent: '#e0f2fe', glow: 'rgba(224,242,254,0.22)' },
  [WEATHER_MODES.STORM]: { accent: '#fbbf24', glow: 'rgba(251,191,36,0.16)' },
  [WEATHER_MODES.NIGHT_CLEAR]: { accent: '#a5b4fc', glow: 'rgba(165,180,252,0.22)' },
};

const DEFAULT_SKY = { mode: WEATHER_MODES.CLEAR, night: false, cloudCover: 20, windSpeed: 8, dayPhase: 'day' };

export default function App() {
  const [view, setView] = useState('map'); // 'map' | 'sky'
  const [selectedState, setSelectedState] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  const sky = weather
    ? getSkyConfig(weather)
    : selectedState ? DEFAULT_SKY : { ...DEFAULT_SKY, mode: WEATHER_MODES.NIGHT_CLEAR, night: true, dayPhase: 'night' };

  const palette = view === 'sky' ? (PALETTES[sky.mode] || PALETTES[WEATHER_MODES.CLEAR]) : PALETTES[WEATHER_MODES.CLEAR];

  const handleSelectState = useCallback(async (state) => {
    setHasInteracted(true);
    setSelectedState(state);
    setView('sky');
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const data = await fetchCurrentWeather({ latitude: state.latitude, longitude: state.longitude });
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar o clima.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBack = useCallback(() => {
    setView('map');
    setError('');
  }, []);

  const handlePanelCollapseChange = useCallback((v) => setPanelCollapsed(v), []);

  const themeStyle = useMemo(() => ({
    '--accent': palette.accent,
    '--glow': palette.glow,
  }), [palette]);

  return (
    <div className="app" style={themeStyle}>
      <Experience view={view} selectedState={selectedState} onSelectState={handleSelectState} sky={sky} panelCollapsed={panelCollapsed} />

      <div className="overlay">
        <header className="titlebar">
          <span className="title-mark" aria-hidden="true">◌</span>
          <span className="title-text">Atmos Brasil</span>
        </header>

        <WeatherPanel
          view={view}
          state={selectedState}
          weather={weather}
          loading={loading}
          error={error}
          onBack={handleBack}
          onCollapseChange={handlePanelCollapseChange}
        />

        {!hasInteracted && view === 'map' && (
          <div className="hint" role="status">Clique em um estado para ver o céu da capital</div>
        )}
      </div>
    </div>
  );
}
