"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { ZoneLayer } from "./ZoneLayer";
import UserLocation from "./UserLocation";
import { DestinationMarkers, Destination } from "./DestinationMarkers";
import zonesData from "@/data/zones.json";

interface Zone {
  id: string;
  name: string;
  level: 1 | 2 | 3;
  coordinates: [number, number][];
  description?: string;
}

export default function LeafletMap() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

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

  useEffect(() => {
    const loadZones = async () => {
      try {
        const res = await fetch("/api/zones");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setZones(normalizeData(data));
      } catch (error) {
        console.warn("Cargando fallback de zones.json:", error);
        setZones(normalizeData(zonesData));
      }
    };

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

    loadZones();
    loadDestinations();
  }, []);

  return (
    <MapContainer
      center={[-8.1074, -79.0099]}
      zoom={15}
      className="w-full h-screen"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ZoneLayer zones={zones} />
      <DestinationMarkers destinations={destinations} />
      <UserLocation />
    </MapContainer>
  );
}
