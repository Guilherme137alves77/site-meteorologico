import { useEffect, useState } from 'react';
import { getWeatherLabel } from '../../utils/weatherCodes';

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

function formatTime(iso) {
  if (!iso) return '--:--';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(11, 16) || '--:--';
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function WeatherPanel({ view, state, weather, loading, error, onBack, onCollapseChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const filled = view === 'sky';

  useEffect(() => {
    onCollapseChange?.(collapsed);
  }, [collapsed, onCollapseChange]);

  const isCollapsed = view === 'sky' ? collapsed : false;

  // Mobile: collapsed drawer shows a compact strip (state + temp).
  const handlePanelClick = () => {
    if (filled && isCollapsed) setCollapsed(false);
  };

  return (
    <aside
      className={`panel glass ${filled ? 'is-filled' : 'is-idle'} ${isCollapsed ? 'is-collapsed' : ''}`}
      aria-live="polite"
      onClick={handlePanelClick}
    >
      <div className="panel-top">
        <div className="panel-top-left">
          <p className="eyebrow">Clima</p>
          {filled && isCollapsed && state && (
            <p className="panel-compact">
              {state.capital} · {weather ? `${Math.round(weather.temperature)}°C` : '...'}
            </p>
          )}
        </div>
        {view === 'sky' && (
          <div className="panel-actions">
            <button
              type="button"
              className="collapse-btn"
              onClick={(e) => { e.stopPropagation(); setCollapsed((v) => !v); }}
              aria-label={isCollapsed ? 'Expandir painel' : 'Recolher painel'}
            >
              {isCollapsed ? '▲' : '▼'}
            </button>
            <button type="button" className="back-btn" onClick={(e) => { e.stopPropagation(); onBack(); }}>
              ← Voltar ao mapa
            </button>
          </div>
        )}
      </div>

      {view === 'map' ? (
        <div className="panel-idle">
          <h1 className="city-name">Selecione um estado</h1>
          <p className="panel-message subtle">
            Clique em um estado no mapa para carregar o céu em tempo real da capital.
          </p>
        </div>
      ) : (
        <>
          <div className="panel-header">
            <p className="panel-state">{state?.name} · {state?.sigla}</p>
            <h1 className="city-name">{state?.capital}</h1>
          </div>

          {loading && <p className="panel-message">Carregando clima da capital...</p>}
          {error && !loading && <p className="panel-message error">{error}</p>}

          {!loading && !error && weather && (
            <>
              <div className="temp-block">
                <div className="temp-main">{Math.round(weather.temperature)}°C</div>
                <div className="temp-desc">{getWeatherLabel(weather.code)}</div>
              </div>
              <div className="stats">
                <Stat label="Sensação" value={`${Math.round(weather.apparent)}°C`} />
                <Stat label="Umidade" value={`${Math.round(weather.humidity)}%`} />
                <Stat label="Vento" value={`${Math.round(weather.wind)} km/h`} />
              </div>
              <div className="panel-meta">
                <span className="panel-meta-item">Atualizado às {formatTime(weather.time)}</span>
                <span className="panel-meta-item">Nuvens: {Math.round(weather.cloudCover)}%</span>
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
}
