"use client";

import { useEffect, useState } from "react";
import * as turf from "@turf/turf";

interface Zone {
  id: string;
  name: string;
  level: 1 | 2 | 3;
  coordinates: [number, number][];
}

interface Position {
  lat: number;
  lng: number;
}

interface GeoAlertResult {
  userPos: Position | null;
  currentZone: Zone | null;
}

export function useGeoAlerts(zones: Zone[]): GeoAlertResult {
  const [userPos, setUserPos] = useState<Position | null>(null);
  const [currentZone, setCurrentZone] = useState<Zone | null>(null);

  useEffect(() => {
    if (!navigator.geolocation || zones.length === 0) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const point = turf.point([lng, lat]);

        setUserPos({ lat, lng });

        const dangerZones = zones.filter((z) => z.level === 3);

        let foundZone: Zone | null = null;

        for (const zone of dangerZones) {
          const polygon = turf.polygon([
            zone.coordinates.map(([lat, lng]) => [lng, lat]),
          ]);

          const isInside = turf.booleanPointInPolygon(point, polygon);

          if (isInside) {
            foundZone = zone;
            break;
          }
        }

        setCurrentZone(foundZone);
      },
      (err) => {
        console.error("Geo error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [zones]);

  return { userPos, currentZone };
}
