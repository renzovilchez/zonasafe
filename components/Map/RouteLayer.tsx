"use client";

import { Polyline } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-arrowheads";

interface Props {
  coordinates: [number, number][] | null;
}

export default function RouteLayer({ coordinates }: Props) {
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!polylineRef.current || !coordinates) return;

    // @ts-ignore
    polylineRef.current.arrowheads({
      size: "10px",
      frequency: "50px",
      fill: true,
      color: "#1A6B3C",
    });
  }, [coordinates]);

  if (!coordinates || coordinates.length === 0) return null;

  return (
    <Polyline
      ref={(ref) => {
        if (ref) polylineRef.current = ref;
      }}
      positions={coordinates}
      pathOptions={{
        color: "#1A6B3C",
        weight: 5,
        opacity: 0.8,
      }}
    />
  );
}
