"use client";

import { Destination } from "@/components/Map/DestinationMarkers";

const CATEGORY_LABEL: Record<string, string> = {
  market: "Mercado",
  factory: "Fábrica",
  gallery: "Galería",
};

const CATEGORY_COLOR: Record<string, string> = {
  market: "bg-green-100 text-green-800",
  factory: "bg-amber-100 text-amber-800",
  gallery: "bg-blue-100 text-blue-800",
};

interface Props {
  destination: Destination | null;
  onClose: () => void;
  onRoute: (destination: Destination) => void;
}

export default function DestinationCard({
  destination,
  onClose,
  onRoute,
}: Props) {
  if (!destination) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-1000 w-[90%] max-w-sm bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-1.5 ${CATEGORY_COLOR[destination.category]}`}
            >
              {CATEGORY_LABEL[destination.category]}
            </span>
            <p className="text-base font-medium text-gray-900 leading-snug">
              {destination.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 leading-none"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="px-5 pb-3 flex flex-col gap-2">
        {destination.address && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {destination.address}
          </div>
        )}
        {destination.open_hours && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {destination.open_hours}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 px-5 py-3">
        <button
          onClick={() => onRoute(destination)}
          className="w-full py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3" />
          </svg>
          Trazar ruta
        </button>
      </div>
    </div>
  );
}
