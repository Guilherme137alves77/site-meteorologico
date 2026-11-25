import brazilGeo from '../data/brazil-states.json';
import { getPolygons, project } from './geo';

// Compute projected bounds of Brazil once for camera framing.
function computeBounds() {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const feature of brazilGeo.features || []) {
    for (const poly of getPolygons(feature.geometry)) {
      for (const ring of poly) {
        for (const [lon, lat] of ring) {
          const [x, y] = project([lon, lat]);
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  const width = maxX - minX;
  const height = maxY - minY;
  return {
    minX, minY, maxX, maxY, width, height,
    centerX: (minX + maxX) / 2,
    centerZ: -((minY + maxY) / 2), // projected Y becomes -Z after map rotation
  };
}

export const BRAZIL_BOUNDS = computeBounds();
