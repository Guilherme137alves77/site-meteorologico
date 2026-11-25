import { Html } from '@react-three/drei';
import { useMemo, useState } from 'react';
import { ExtrudeGeometry, Shape } from 'three';
import brazilGeo from '../../data/brazil-states.json';
import { STATES_BY_ID } from '../../data/states';
import { getPolygons, project } from '../../utils/geo';

function ringToShape(ring) {
  // Project lon/lat to local X/Y, then build a Three.js Shape for extrusion.
  const shape = new Shape();
  ring.forEach(([lon, lat], i) => {
    const [x, y] = project([lon, lat]);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

function geometryToMeshes(geometry) {
  const polygons = getPolygons(geometry);
  const meshes = [];

  polygons.forEach((poly) => {
    const [outer, ...holes] = poly;
    if (!outer || outer.length < 3) return;
    const shape = ringToShape(outer);
    holes.forEach((hole) => {
      if (hole.length >= 3) shape.holes.push(ringToShape(hole));
    });
    // ExtrudeGeometry gives each state a slight 3D relief.
    const geom = new ExtrudeGeometry(shape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 1,
    });
    // GeoJSON coords are in XY plane; rotate so map lies flat on XZ.
    geom.rotateX(-Math.PI / 2);
    meshes.push(geom);
  });

  return meshes;
}

function StateMesh({ feature, _selectedId, hoveredId, onHover, onSelect }) {
  const id = String(feature.properties.codarea);
  const state = STATES_BY_ID[id];
  const geometries = useMemo(() => geometryToMeshes(feature.geometry), [feature]);

  const isHovered = hoveredId === id;
  // High contrast so states are clearly visible on dark map background.
  const color = isHovered ? '#d6efff' : '#9fd0f5';
  const emissive = isHovered ? '#8fd8ff' : '#3d7ab5';
  const outlineColor = isHovered ? '#eaf7ff' : '#c8e6ff';

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover({ id, name: state?.name || id, point: e.point.clone() });
      }}
      onPointerMove={(e) => {
        if (isHovered) onHover({ id, name: state?.name || id, point: e.point.clone() });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (state) onSelect(state);
      }}
    >
      {geometries.map((geom, i) => (
        <group key={i}>
          <mesh geometry={geom} castShadow receiveShadow>
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={isHovered ? 0.5 : 0.34}
              roughness={0.38}
              metalness={0.06}
            />
          </mesh>
          {/* Subtle outline to separate adjacent states. */}
          <lineSegments>
            <edgesGeometry args={[geom, 12]} />
            <lineBasicMaterial color={outlineColor} transparent opacity={isHovered ? 0.95 : 0.55} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

export default function BrazilMap({ selectedId, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const features = brazilGeo.features || [];

  return (
    <group position={[0, -0.15, 0]}>
      {features.map((feature) => (
        <StateMesh
          key={feature.properties.codarea}
          feature={feature}
          _selectedId={selectedId}
          hoveredId={hovered?.id}
          onHover={setHovered}
          onSelect={onSelect}
        />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
        <circleGeometry args={[8.6, 64]} />
        <meshStandardMaterial color="#050b14" roughness={1} metalness={0} transparent opacity={0.25} />
      </mesh>
      {hovered?.point && (
        <Html position={[hovered.point.x, hovered.point.y + 0.35, hovered.point.z]} center style={{ pointerEvents: 'none' }}>
          <div className="map-tooltip">{hovered.name}</div>
        </Html>
      )}
    </group>
  );
}
