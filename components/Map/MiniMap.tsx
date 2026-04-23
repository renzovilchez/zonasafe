"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix del ícono roto de Leaflet en Next.js (problema conocido con webpack)
const markerIcon = L.icon({
  iconUrl: "/icons/marker.svg", // pon un SVG tuyo aquí
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

interface MiniMapProps {
  selectedPos: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
}

// Componente interno que escucha clicks en el mapa
function ClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MiniMap({ selectedPos, onMapClick }: MiniMapProps) {
  // Centro inicial: El Porvenir, Trujillo
  const center: [number, number] = [-8.1074, -79.0099];

  return (
    <MapContainer
      center={selectedPos ? [selectedPos.lat, selectedPos.lng] : center}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler onMapClick={onMapClick} />
      {selectedPos && (
        <Marker
          position={[selectedPos.lat, selectedPos.lng]}
          icon={markerIcon}
        />
      )}
    </MapContainer>
  );
}

export default MiniMap;
