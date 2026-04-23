import { useState, useEffect } from "react";
import { getActiveZone, ZoneForGeo, LatLng } from "@/lib/geo";

export function useGeoAlerts(zones: ZoneForGeo[]) {
  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [currentZone, setCurrentZone] = useState<ZoneForGeo | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);

  useEffect(() => {
    if (userPos && zones.length > 0) {
      setCurrentZone(getActiveZone(userPos, zones));
    }
  }, [userPos, zones]);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        console.error("GPS error:", err.message, err.code);
        setError(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { userPos, currentZone, error };
}
