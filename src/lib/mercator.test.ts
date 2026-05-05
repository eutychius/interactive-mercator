import { describe, expect, it } from 'vitest';
import {
  MAX_MERCATOR_LAT,
  centerFromDrag,
  clampMercatorLatitude,
  normalizeLongitude
} from './mercator';

describe('mercator helpers', () => {
  it('clamps latitude to safe mercator bounds', () => {
    expect(clampMercatorLatitude(120)).toBe(MAX_MERCATOR_LAT);
    expect(clampMercatorLatitude(-120)).toBe(-MAX_MERCATOR_LAT);
  });

  it('wraps longitude into the standard range', () => {
    expect(normalizeLongitude(190)).toBe(-170);
    expect(normalizeLongitude(-190)).toBe(170);
  });

  it('translates drag distance into a new center', () => {
    const center = centerFromDrag({ lon: 0, lat: 0 }, 200, -100, {
      width: 800,
      height: 400
    });

    expect(center.lon).toBe(-90);
    expect(center.lat).toBe(-40);
  });
});
