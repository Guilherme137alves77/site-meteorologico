const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchCurrentWeather({ latitude, longitude, signal }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day,cloud_cover',
    timezone: 'auto',
  });

  const response = await fetch(`${WEATHER_URL}?${params}`, { signal });
  if (!response.ok) {
    throw new Error('Não foi possível carregar o clima.');
  }

  const data = await response.json();
  const current = data.current;
  if (!current) {
    throw new Error('Dados de clima indisponíveis.');
  }

  return {
    temperature: current.temperature_2m,
    apparent: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    wind: current.wind_speed_10m,
    cloudCover: current.cloud_cover,
    code: current.weather_code,
    isDay: current.is_day,
    time: current.time,
  };
}
