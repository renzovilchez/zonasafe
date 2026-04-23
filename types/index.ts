export interface Route {
  id: string;
  name: string;
  coordinates: [number, number][];
}

export type ZoneLevel = 1 | 2 | 3;

export interface Zone {
  id: string;
  name: string;
  level: ZoneLevel;
  description: string | null;
  source: string | null;
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export interface Destination {
  id: string;
  name: string;
  category: "market" | "factory" | "gallery";
  lat: number;
  lng: number;
  address: string | null;
  description: string | null;
  open_hours: string | null;
}

export interface RouteGeoJSON {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
}

export const ZONE_COLORS: Record<ZoneLevel, string> = {
  1: "#22c55e",
  2: "#f59e0b",
  3: "#ef4444",
};
