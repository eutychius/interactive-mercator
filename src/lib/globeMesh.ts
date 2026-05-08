import { Mesh, type Object3D } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import type { LonLat, Triangle } from './mercator';

function uvToLonLat(u: number, v: number): LonLat {
  return [u * 360 - 180, 90 - v * 180];
}

function unwrapTriangle(triangle: Triangle): Triangle {
  const longitudes = triangle.map(([longitude]) => longitude);
  const span = Math.max(...longitudes) - Math.min(...longitudes);

  if (span <= 180) {
    return triangle;
  }

  return triangle.map(([longitude, latitude]) => [
    longitude < 0 ? longitude + 360 : longitude,
    latitude,
  ]) as Triangle;
}

export async function loadGlobeMesh(assetUrl: string): Promise<Triangle[]> {
  const loader = new OBJLoader();
  const object = await loader.loadAsync(assetUrl);
  const triangles: Triangle[] = [];

  object.traverse((child: Object3D) => {
    if (!(child instanceof Mesh) || child.name === 'Plane') {
      return;
    }

    const geometry = child.geometry.index
      ? child.geometry.toNonIndexed()
      : child.geometry.clone();
    const uv = geometry.getAttribute('uv');

    if (!uv) {
      return;
    }

    for (let index = 0; index < uv.count; index += 3) {
      const triangle = unwrapTriangle([
        uvToLonLat(uv.getX(index), uv.getY(index)),
        uvToLonLat(uv.getX(index + 1), uv.getY(index + 1)),
        uvToLonLat(uv.getX(index + 2), uv.getY(index + 2)),
      ]);

      triangles.push(triangle);
    }
  });

  return triangles.filter((_, index) => index % 2 === 0);
}
