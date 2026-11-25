// Simple equirectangular projection centered on Brazil.
// Good enough for a stylized 3D map (not geodetically precise).
const CENTER_LON = -54;
const CENTER_LAT = -14;
const SCALE = 0.55;

export function project([lon, lat]) {
  const x = (lon - CENTER_LON) * SCALE * Math.cos((CENTER_LAT * Math.PI) / 180);
  const y = (lat - CENTER_LAT) * SCALE;
  return [x, y];
}

// Converts GeoJSON Polygon/MultiPolygon coordinates into arrays of rings.
export function getPolygons(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return [geometry.coordinates];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates;
  return [];
}
