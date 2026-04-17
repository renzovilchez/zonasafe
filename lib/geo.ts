import * as turf from "@turf/turf";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface ZoneForGeo {
  id: string;
  name: string;
  level: 1 | 2 | 3;
  coordinates: [number, number][];
}

export function pointInPolygon(pos: LatLng, zone: ZoneForGeo): boolean {
  try {
    const point = turf.point([pos.lng, pos.lat]);
    const polygon = turf.polygon([
      zone.coordinates.map(([lat, lng]) => [lng, lat]),
    ]);
    return turf.booleanPointInPolygon(point, polygon);
  } catch {
    return false;
  }
}

export function distanceMeters(a: LatLng, b: LatLng): number {
  const from = turf.point([a.lng, a.lat]);
  const to = turf.point([b.lng, b.lat]);
  return turf.distance(from, to, { units: "kilometers" }) * 1000;
}

export function getActiveZone(
  pos: LatLng,
  zones: ZoneForGeo[],
): ZoneForGeo | null {
  const inside = zones.filter((z) => pointInPolygon(pos, z));
  if (inside.length === 0) return null;
  return inside.reduce((prev, curr) => (curr.level > prev.level ? curr : prev));
}
