"use client";

import { useEffect, useState } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";

interface Position {
  lat: number;
  lng: number;
}

const userIcon = L.divIcon({
  className: "",
  html: `<div class="pulse-marker"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function UserLocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    let hasCentered = false;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setPosition(coords);

        if (!hasCentered) {
          map.setView([coords.lat, coords.lng], 16);
          hasCentered = true;
        }
      },
      (err) => {
        console.error("GPS error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  if (!position) return null;

  return <Marker position={[position.lat, position.lng]} icon={userIcon} />;
}
