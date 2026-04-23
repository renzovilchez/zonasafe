"use client";

import dynamic from "next/dynamic";
import GpsBanner from "@/components/Map/GpsBanner";
import { useGeoAlerts } from "@/hooks/useGeoAlerts";
import type { Zone } from "@/types";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
});

interface MapContainerProps {
  zones: Zone[];
}

export default function MapContainer({ zones }: MapContainerProps) {
  const { userPos, gpsStatus } = useGeoAlerts(zones);

  return (
    <>
      {gpsStatus === "unavailable" && <GpsBanner />}
      <LeafletMap zones={zones} userPos={userPos} />
    </>
  );
}
