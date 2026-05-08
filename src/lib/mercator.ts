import {
  geoGraticule10,
  geoMercator,
  geoOrthographic,
  geoPath,
  type GeoProjection,
} from 'd3-geo';

export type MapCenter = {
  lon: number;
  lat: number;
};

export type LonLat = [number, number];
export type Triangle = [LonLat, LonLat, LonLat];
export type Viewport = {
  width: number;
  height: number;
};

export type ProjectionKind = 'mercator' | 'orthographic';

export const MAX_MERCATOR_LAT = 80;
export const MAX_ORTHOGRAPHIC_LAT = 89.999;

const WORLD_SPHERE = { type: 'Sphere' } as const;

export function clampMercatorLatitude(latitude: number): number {
  return Math.max(-MAX_MERCATOR_LAT, Math.min(MAX_MERCATOR_LAT, latitude));
}

export function clampOrthographicLatitude(latitude: number): number {
  return Math.max(
    -MAX_ORTHOGRAPHIC_LAT,
    Math.min(MAX_ORTHOGRAPHIC_LAT, latitude),
  );
}

export function normalizeLongitude(longitude: number): number {
  return ((((longitude + 180) % 360) + 360) % 360) - 180;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function lonLatToVector([longitude, latitude]: LonLat): [
  number,
  number,
  number,
] {
  const lon = toRadians(longitude);
  const lat = toRadians(latitude);
  const cosLat = Math.cos(lat);

  return [cosLat * Math.cos(lon), Math.sin(lat), cosLat * Math.sin(lon)];
}

function isTriangleVisibleOrthographic(
  triangle: Triangle,
  center: MapCenter,
): boolean {
  const centerLon = toRadians(center.lon);
  const centerLat = toRadians(center.lat);
  const cosCenterLat = Math.cos(centerLat);
  const centerVector: [number, number, number] = [
    cosCenterLat * Math.cos(centerLon),
    Math.sin(centerLat),
    cosCenterLat * Math.sin(centerLon),
  ];

  return triangle.some((point) => {
    const vector = lonLatToVector(point);
    const dot =
      vector[0] * centerVector[0] +
      vector[1] * centerVector[1] +
      vector[2] * centerVector[2];

    return dot >= -0.08;
  });
}

export function centerFromDrag(
  startCenter: MapCenter,
  deltaX: number,
  deltaY: number,
  viewport: Viewport,
  projectionKind: ProjectionKind,
): MapCenter {
  const safeWidth = Math.max(viewport.width, 1);
  const safeHeight = Math.max(viewport.height, 1);
  const nextLon = normalizeLongitude(
    startCenter.lon - (deltaX / safeWidth) * 360,
  );
  const nextLatRaw = startCenter.lat + (deltaY / safeHeight) * 180;
  const nextLat =
    projectionKind === 'orthographic'
      ? clampOrthographicLatitude(nextLatRaw)
      : clampMercatorLatitude(nextLatRaw);

  return { lon: nextLon, lat: nextLat };
}

function createProjectionWithFit(
  factory: () => GeoProjection,
  viewport: Viewport,
  center: MapCenter,
): GeoProjection {
  const pad = Math.max(24, Math.min(viewport.width, viewport.height) * 0.04);

  return factory()
    .precision(0.2)
    .center([0, 0])
    .rotate([-center.lon, -center.lat])
    .fitExtent(
      [
        [pad, pad],
        [
          Math.max(pad + 1, viewport.width - pad),
          Math.max(pad + 1, viewport.height - pad),
        ],
      ],
      WORLD_SPHERE,
    );
}

export function createMercatorProjection(
  viewport: Viewport,
  center: MapCenter,
): GeoProjection {
  const pad = Math.max(24, Math.min(viewport.width, viewport.height) * 0.04);
  const usableWidth = Math.max(1, viewport.width - pad * 2);
  const usableHeight = Math.max(1, viewport.height - pad * 2);
  const mercatorYLimit = Math.log(
    Math.tan(Math.PI / 4 + (MAX_MERCATOR_LAT * Math.PI) / 180 / 2),
  );
  const scaleFromWidth = usableWidth / (2 * Math.PI);
  const scaleFromHeight = usableHeight / (mercatorYLimit * 2);
  const scale = Math.min(scaleFromWidth, scaleFromHeight);

  return geoMercator()
    .precision(0.2)
    .center([0, 0])
    .rotate([-center.lon, -center.lat])
    .translate([viewport.width / 2, viewport.height / 2])
    .scale(scale);
}

export function createOrthographicProjection(
  viewport: Viewport,
  center: MapCenter,
): GeoProjection {
  return createProjectionWithFit(geoOrthographic, viewport, center).clipAngle(
    90.0001,
  );
}

export function createProjection(
  viewport: Viewport,
  center: MapCenter,
  projectionKind: ProjectionKind,
): GeoProjection {
  return projectionKind === 'orthographic'
    ? createOrthographicProjection(viewport, center)
    : createMercatorProjection(viewport, center);
}

export function drawScene(options: {
  context: CanvasRenderingContext2D;
  viewport: Viewport;
  center: MapCenter;
  projectionKind: ProjectionKind;
  land:
    | GeoJSON.FeatureCollection<GeoJSON.Geometry>
    | GeoJSON.Feature<GeoJSON.Geometry>;
  meshTriangles: Triangle[];
}): void {
  const { context, viewport, center, projectionKind, land, meshTriangles } =
    options;
  const projection = createProjection(viewport, center, projectionKind);
  const path = geoPath(projection, context);

  context.clearRect(0, 0, viewport.width, viewport.height);
  context.fillStyle = '#04121d';
  context.fillRect(0, 0, viewport.width, viewport.height);

  if (projectionKind === 'orthographic') {
    context.beginPath();
    path(WORLD_SPHERE);
    context.fillStyle = '#0a2334';
    context.fill();
    context.strokeStyle = 'rgba(123, 186, 217, 0.25)';
    context.lineWidth = 1;
    context.stroke();
  }

  context.beginPath();
  path(geoGraticule10());
  context.strokeStyle = 'rgba(123, 186, 217, 0.18)';
  context.lineWidth = 0.8;
  context.stroke();

  context.beginPath();
  for (const triangle of meshTriangles) {
    if (
      projectionKind === 'orthographic' &&
      !isTriangleVisibleOrthographic(triangle, center)
    ) {
      continue;
    }

    path({
      type: 'Polygon',
      coordinates: [[triangle[0], triangle[1], triangle[2], triangle[0]]],
    });
  }
  context.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  context.lineWidth = 0.5;
  context.stroke();

  context.beginPath();
  path(land);
  context.fillStyle = '#c7de78';
  context.fill();
  context.strokeStyle = 'rgba(5, 18, 29, 0.35)';
  context.lineWidth = 0.75;
  context.stroke();
}
