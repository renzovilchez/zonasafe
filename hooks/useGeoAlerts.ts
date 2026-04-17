import { useState, useEffect } from "react";
import { getActiveZone, ZoneForGeo, LatLng } from "@/lib/geo";

export function useGeoAlerts(zones: ZoneForGeo[]) {
  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [currentZone, setCurrentZone] = useState<ZoneForGeo | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos: LatLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserPos(newPos);
        setCurrentZone(getActiveZone(newPos, zones));
      },
      (err) => console.error("GPS error:", err),
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [zones]);

  return { userPos, currentZone };
}
