import { describe, expect, it } from 'vitest';
import {
  MAX_MERCATOR_LAT,
  MAX_ORTHOGRAPHIC_LAT,
  centerFromDrag,
  clampMercatorLatitude,
  clampOrthographicLatitude,
  normalizeLongitude
} from './mercator';

describe('mercator helpers', () => {
  it('clamps latitude to safe mercator bounds', () => {
    expect(clampMercatorLatitude(120)).toBe(MAX_MERCATOR_LAT);
    expect(clampMercatorLatitude(-120)).toBe(-MAX_MERCATOR_LAT);
  });

  it('clamps latitude to orthographic pole bounds', () => {
    expect(clampOrthographicLatitude(120)).toBe(MAX_ORTHOGRAPHIC_LAT);
    expect(clampOrthographicLatitude(-120)).toBe(-MAX_ORTHOGRAPHIC_LAT);
  });

  it('wraps longitude into the standard range', () => {
    expect(normalizeLongitude(190)).toBe(-170);
    expect(normalizeLongitude(-190)).toBe(170);
  });

  it('translates drag distance into a new center', () => {
    const center = centerFromDrag(
      { lon: 0, lat: 0 },
      200,
      -100,
      {
        width: 800,
        height: 400
      },
      'mercator'
    );

    expect(center.lon).toBe(-90);
    expect(center.lat).toBe(-45);
  });

  it('allows orthographic drag to reach near the poles', () => {
    const center = centerFromDrag(
      { lon: 0, lat: 80 },
      0,
      100,
      {
        width: 800,
        height: 400
      },
      'orthographic'
    );

    expect(center.lat).toBe(MAX_ORTHOGRAPHIC_LAT);
  });
});
