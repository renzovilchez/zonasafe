"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

if (typeof window !== "undefined") {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

export interface Destination {
  id: string;
  name: string;
  category: "market" | "factory" | "gallery";
  lat: number;
  lng: number;
  address?: string;
  description?: string;
  open_hours?: string;
}

const shoeIcon = L.icon({
  iconUrl: "/icons/shoe.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface DestinationMarkersProps {
  destinations: Destination[];
}

const categoryLabels: Record<string, string> = {
  market: "Mercado/Feria",
  factory: "Fábrica/Taller",
  gallery: "Galería Comercial",
};

export function DestinationMarkers({ destinations }: DestinationMarkersProps) {
  return (
    <>
      {destinations.map((d) => (
        <Marker key={d.id} position={[d.lat, d.lng]} icon={shoeIcon}>
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-lg mb-1">{d.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs uppercase">
                  {categoryLabels[d.category] || d.category}
                </span>
              </p>
              {d.address && (
                <p className="text-sm italic text-gray-700">📍 {d.address}</p>
              )}
              {d.open_hours && (
                <p className="text-xs text-gray-500 mt-2">🕒 {d.open_hours}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
