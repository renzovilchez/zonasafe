import { Polygon, Tooltip } from "react-leaflet";

interface Zone {
  id: string;
  name: string;
  level: 1 | 2 | 3;
  coordinates: [number, number][];
  description?: string;
}

interface ZoneLayerProps {
  zones: Zone[];
}

const ZONE_COLORS = {
  1: { fill: "#639922", stroke: "#3B6D11" }, // Verde
  2: { fill: "#EF9F27", stroke: "#854F0B" }, // Amarillo
  3: { fill: "#E24B4A", stroke: "#A32D2D" }, // Rojo
};

const ZONE_LABELS = {
  1: "Zona segura",
  2: "Zona de precaución",
  3: "Zona de peligro",
};

export function ZoneLayer({ zones }: ZoneLayerProps) {
  return (
    <>
      {zones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.coordinates}
          pathOptions={{
            color: ZONE_COLORS[zone.level].stroke,
            fillColor: ZONE_COLORS[zone.level].fill,
            fillOpacity: 0.25,
            weight: 1.5,
          }}
        >
          <Tooltip sticky>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{zone.name}</p>
              <p className="text-xs text-gray-500">{ZONE_LABELS[zone.level]}</p>
              {zone.description && (
                <p className="text-xs text-gray-500 mt-1">{zone.description}</p>
              )}
            </div>
          </Tooltip>
        </Polygon>
      ))}
    </>
  );
}
