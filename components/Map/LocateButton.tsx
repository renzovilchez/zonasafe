"use client";

import { useMap } from "react-leaflet";
import { useState, useCallback } from "react";

export default function LocateButton() {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isLocating) return;

      setIsLocating(true);

      const onLocationFound = () => {
        setIsLocating(false);
        cleanup();
      };

      const onLocationError = (err: L.ErrorEvent) => {
        setIsLocating(false);
        console.error("Error de geolocalización:", err.message);
        cleanup();
      };

      const cleanup = () => {
        map.off("locationfound", onLocationFound);
        map.off("locationerror", onLocationError);
      };

      map.on("locationfound", onLocationFound);
      map.on("locationerror", onLocationError);

      map.locate({
        setView: true,
        maxZoom: 17,
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      setTimeout(() => {
        setIsLocating(false);
        cleanup();
      }, 12000);
    },
    [map, isLocating],
  );

  return (
    <form onSubmit={handleLocate} className="absolute bottom-44 left-8 z-1000">
      <button
        type="submit"
        disabled={isLocating}
        className="relative w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 
                   flex items-center justify-center transition-all hover:bg-gray-50 
                   active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30"
        title="Mi ubicación"
        aria-label="Centrar mapa en mi ubicación"
      >
        {isLocating && (
          <span className="absolute inset-0 rounded-full border-2 border-[#185FA5] animate-ping" />
        )}

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#185FA5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isLocating ? "animate-spin" : ""}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          <circle cx="12" cy="12" r="8" />
        </svg>
      </button>
    </form>
  );
}
