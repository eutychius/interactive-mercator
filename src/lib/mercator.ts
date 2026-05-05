import { geoGraticule10, geoMercator, geoPath, type GeoProjection } from 'd3-geo';

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

export const MAX_MERCATOR_LAT = 80;

export function clampMercatorLatitude(latitude: number): number {
  return Math.max(-MAX_MERCATOR_LAT, Math.min(MAX_MERCATOR_LAT, latitude));
}

export function normalizeLongitude(longitude: number): number {
  return ((longitude + 180) % 360 + 360) % 360 - 180;
}

export function centerFromDrag(
  startCenter: MapCenter,
  deltaX: number,
  deltaY: number,
  viewport: Viewport
): MapCenter {
  const safeWidth = Math.max(viewport.width, 1);
  const safeHeight = Math.max(viewport.height, 1);
  const nextLon = normalizeLongitude(startCenter.lon - (deltaX / safeWidth) * 360);
  const nextLat = clampMercatorLatitude(
    startCenter.lat + (deltaY / safeHeight) * (MAX_MERCATOR_LAT * 2)
  );

  return { lon: nextLon, lat: nextLat };
}

export function createMercatorProjection(viewport: Viewport, center: MapCenter): GeoProjection {
  const pad = Math.max(24, Math.min(viewport.width, viewport.height) * 0.04);
  const usableWidth = Math.max(1, viewport.width - pad * 2);
  const usableHeight = Math.max(1, viewport.height - pad * 2);
  const mercatorYLimit = Math.log(Math.tan(Math.PI / 4 + ((MAX_MERCATOR_LAT * Math.PI) / 180) / 2));
  const scaleFromWidth = usableWidth / (2 * Math.PI);
  const scaleFromHeight = usableHeight / (mercatorYLimit * 2);
  const scale = Math.min(scaleFromWidth, scaleFromHeight);

  const projection = geoMercator()
    .precision(0.2)
    .center([0, 0])
    .rotate([-center.lon, -center.lat])
    .translate([viewport.width / 2, viewport.height / 2])
    .scale(scale)
    .clipExtent([
      [pad, pad],
      [viewport.width - pad, viewport.height - pad]
    ]);

  return projection;
}

export function drawScene(options: {
  context: CanvasRenderingContext2D;
  viewport: Viewport;
  center: MapCenter;
  land: GeoJSON.FeatureCollection<GeoJSON.Geometry> | GeoJSON.Feature<GeoJSON.Geometry>;
  meshTriangles: Triangle[];
}): void {
  const { context, viewport, center, land, meshTriangles } = options;
  const projection = createMercatorProjection(viewport, center);
  const path = geoPath(projection, context);

  context.clearRect(0, 0, viewport.width, viewport.height);
  context.fillStyle = '#04121d';
  context.fillRect(0, 0, viewport.width, viewport.height);

  context.beginPath();
  path({ type: 'Sphere' });
  context.fillStyle = '#072235';
  context.fill();

  context.beginPath();
  path(geoGraticule10());
  context.strokeStyle = 'rgba(123, 186, 217, 0.18)';
  context.lineWidth = 0.8;
  context.stroke();

  context.beginPath();
  for (const triangle of meshTriangles) {
    path({
      type: 'Polygon',
      coordinates: [[triangle[0], triangle[1], triangle[2], triangle[0]]]
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

  context.beginPath();
  path({ type: 'Sphere' });
  context.strokeStyle = 'rgba(235, 247, 255, 0.4)';
  context.lineWidth = 1.1;
  context.stroke();
}
