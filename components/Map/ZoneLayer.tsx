import { Polygon } from "react-leaflet";

interface Zone {
  id: number;
  name: string;
  level: 1 | 2 | 3;
  coordinates: [number, number][];
}

interface ZoneLayerProps {
  zones: Zone[];
}

const levelColors = {
  1: "#22c55e", // verde
  2: "#f59e0b", // amarillo
  3: "#ef4444", // rojo
};

export function ZoneLayer({ zones }: ZoneLayerProps) {
  return (
    <>
      {zones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.coordinates}
          pathOptions={{
            color: levelColors[zone.level],
            fillColor: levelColors[zone.level],
            fillOpacity: 0.35,
            weight: 2,
          }}
        />
      ))}
    </>
  );
}
