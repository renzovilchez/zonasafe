"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { ZoneLayer } from "./ZoneLayer";
import UserLocation from "./UserLocation";
import ProximityAlert from "./ProximityAlert";
import { DestinationMarkers, Destination } from "./DestinationMarkers";
import RouteLayer from "./RouteLayer";
import { useGeoAlerts } from "@/hooks/useGeoAlerts";
import { getRoute } from "@/lib/ors";
import SearchBar from "@/components/ui/SearchBar";
import DestinationCard from "../ui/DestinationCard";

interface Zone {
  id: string;
  name: string;
  level: 1 | 2 | 3;
  coordinates: [number, number][];
  description?: string;
}

// Componente hijo que tiene acceso a la instancia del mapa
function PrecacheElPorvenir() {
  const map = useMap();

  useEffect(() => {
    const hasPrecached = sessionStorage.getItem("zonasafe-precached");

    if (!hasPrecached) {
      const elPorvenirBounds = L.latLngBounds(
        [-8.075, -79.025], // suroeste
        [-8.025, -78.975], // noreste
      );

      // Guardar vista actual
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();

      // Hacer fitBounds para cargar tiles del área
      map.fitBounds(elPorvenirBounds, { animate: false });

      // Volver a la vista normal después de 2 segundos
      const timer = setTimeout(() => {
        map.setView(currentCenter, currentZoom, { animate: false });
        sessionStorage.setItem("zonasafe-precached", "true");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [map]);

  return null;
}

export default function LeafletMap({ zones: initialZones }: any) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const { userPos, currentZone } = useGeoAlerts(zones);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  const normalizeData = (data: any): Zone[] => {
    // Si viene del GeoJSON estático (FeatureCollection)
    if (data.type === "FeatureCollection") {
      return data.features.map((f: any) => ({
        id: f.id || f.properties.id,
        name: f.properties.name,
        level: f.properties.level,
        description: f.properties.description,
        // GeoJSON [lng, lat] -> Leaflet [lat, lng]
        coordinates: f.geometry.coordinates[0].map(
          (coord: [number, number]) => [coord[1], coord[0]],
        ),
      }));
    }

    // Si viene de Supabase (directamente la tabla)
    if (Array.isArray(data)) {
      return data.map((z: any) => ({
        id: z.id,
        name: z.name,
        level: z.level,
        description: z.description,
        // PostGIS geometry -> Leaflet positions
        coordinates:
          z.geometry.type === "Polygon"
            ? z.geometry.coordinates[0].map((coord: [number, number]) => [
                coord[1],
                coord[0],
              ])
            : [],
      }));
    }

    return [];
  };

  const handleSelectDestination = async (destination: Destination) => {
    setSelectedDestination(destination);
    if (!userPos) return;
    const result = await getRoute(
      [userPos.lat, userPos.lng],
      [destination.lat, destination.lng],
    );
    if (result) setRoute(result.coordinates);
  };

  useEffect(() => {
    setZones(normalizeData(initialZones));

    const loadDestinations = async () => {
      try {
        const res = await fetch("/api/destinations");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setDestinations(data);
      } catch (error) {
        console.error("Error cargando destinos:", error);
      }
    };

    loadDestinations();
  }, [initialZones]);

  useEffect(() => {
    if (!userPos) return;

    const loadRoute = async () => {
      const destination: [number, number] = [-8.105, -79.0065];

      const result = await getRoute([userPos.lat, userPos.lng], destination);

      if (result) {
        setRoute(result.coordinates);
      }
    };

    loadRoute();
  }, [userPos]);

  return (
    <div className="relative w-full h-screen">
      <SearchBar
        destinations={destinations}
        onSelect={handleSelectDestination}
      />
      <MapContainer
        center={[-8.1074, -79.0099]}
        zoom={15}
        className="w-full h-screen"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <PrecacheElPorvenir />
        <ZoneLayer zones={zones} />
        <DestinationMarkers destinations={destinations} />
        <UserLocation position={userPos} />
        <ProximityAlert zone={currentZone} />
        <RouteLayer coordinates={route} />
      </MapContainer>

      <DestinationCard
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onRoute={handleSelectDestination}
      />
    </div>
  );
}
