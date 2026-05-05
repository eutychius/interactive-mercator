import { useEffect, useMemo, useRef, useState } from 'react';
import { feature } from 'topojson-client';
import land110 from 'world-atlas/land-110m.json';
import globeAssetUrl from '../globe.obj?url';
import { loadGlobeMesh } from './lib/globeMesh';
import { centerFromDrag, drawScene, type MapCenter, type Triangle, type Viewport } from './lib/mercator';

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  startCenter: MapCenter;
};

const landTopology = land110 as unknown as { objects: { land: never } };
const landFeature = feature(
  landTopology as unknown as never,
  landTopology.objects.land
) as GeoJSON.FeatureCollection<GeoJSON.Geometry> | GeoJSON.Feature<GeoJSON.Geometry>;

function formatAngle(value: number, positive: string, negative: string): string {
  const direction = value >= 0 ? positive : negative;
  return `${Math.abs(value).toFixed(1)}° ${direction}`;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const [center, setCenter] = useState<MapCenter>({ lon: 0, lat: 12 });
  const [meshTriangles, setMeshTriangles] = useState<Triangle[]>([]);
  const [meshStatus, setMeshStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const element = stageRef.current;

    if (!element) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      setViewport({
        width: Math.max(1, Math.round(entry.contentRect.width)),
        height: Math.max(1, Math.round(entry.contentRect.height))
      });
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadGlobeMesh(globeAssetUrl)
      .then((triangles) => {
        if (cancelled) {
          return;
        }

        setMeshTriangles(triangles);
        setMeshStatus('ready');
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setMeshStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || viewport.width === 0 || viewport.height === 0) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * devicePixelRatio);
    canvas.height = Math.floor(viewport.height * devicePixelRatio);
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    drawScene({
      context,
      viewport,
      center,
      land: landFeature,
      meshTriangles
    });
  }, [center, meshTriangles, viewport]);

  const centerLabel = useMemo(
    () => `${formatAngle(center.lon, 'E', 'W')} / ${formatAngle(center.lat, 'N', 'S')}`,
    [center]
  );

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startCenter: center
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    setCenter(
      centerFromDrag(drag.startCenter, event.clientX - drag.startX, event.clientY - drag.startY, viewport)
    );
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLCanvasElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Interactive Mercator</p>
          <h1>Drag the world until Greenland becomes the center.</h1>
          <p className="lede">
            Land polygons render through a Mercator projection. The downloaded <code>globe.obj</code> also loads
            and draws as a projected mesh overlay, so the app uses the supplied model while keeping a readable map.
          </p>
        </div>

        <div className="telemetry-row">
          <div>
            <span className="telemetry-label">Center</span>
            <strong>{centerLabel}</strong>
          </div>

          <div>
            <span className="telemetry-label">OBJ mesh</span>
            <strong>{meshStatus === 'ready' ? `${meshTriangles.length} triangles` : meshStatus}</strong>
          </div>

          <button className="reset-button" onClick={() => setCenter({ lon: -42, lat: 72 })} type="button">
            Snap to Greenland
          </button>
        </div>
      </section>

      <section className="map-panel">
        <div className="map-stage" ref={stageRef}>
          <canvas
            className="map-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            ref={canvasRef}
          />
        </div>

        <aside className="map-notes">
          <p>Drag left or right to shift the central longitude.</p>
          <p>Drag up or down to shift the central latitude inside safe Mercator bounds.</p>
          <p>The seam wraps at the antimeridian. Greenland shortcut gives a quick acceptance check.</p>
        </aside>
      </section>
    </main>
  );
}
