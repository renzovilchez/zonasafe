"use client";

import { Marker, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";

interface Props {
  position: { lat: number; lng: number } | null;
}

const userIcon = L.divIcon({
  className: "",
  html: `<div class="pulse-marker"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function UserLocation({ position }: Props) {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    if (!position || hasCentered.current) return;

    map.setView([position.lat, position.lng], 16);
    hasCentered.current = true;
  }, [position, map]);

  if (!position) return null;

  return <Marker position={[position.lat, position.lng]} icon={userIcon} />;
}
