"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Props que recibe desde el padre
interface ManualLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (lat: number, lng: number) => void;
}

// El mini-mapa se importa dinámico para evitar el SSR error de Leaflet
const MiniMap = dynamic(() => import("./MiniMap"), { ssr: false });

function ManualLocationModal({
  isOpen,
  onClose,
  onConfirm,
}: ManualLocationModalProps) {
  const [selectedPos, setSelectedPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setSelectedPos(null);
      setSearchText("");
      setSearchError("");
    }
  }, [isOpen]);

  // Buscar dirección con Nominatim (OSM, gratuito, sin API key)
  async function handleSearch() {
    if (!searchText.trim()) return;
    setIsSearching(true);
    setSearchError("");

    try {
      // Añadir "El Porvenir Trujillo" como contexto para mejorar resultados locales
      const query = encodeURIComponent(
        `${searchText}, El Porvenir, Trujillo, Perú`,
      );
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
        {
          headers: {
            // Nominatim requiere un User-Agent identificando tu app
            "Accept-Language": "es",
          },
        },
      );
      const data = await res.json();

      if (data.length === 0) {
        setSearchError(
          "No se encontró esa dirección. Intenta con el nombre de una calle o galería.",
        );
        return;
      }

      setSelectedPos({
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      });
    } catch {
      setSearchError(
        "Error de conexión. Intenta marcar tu ubicación en el mapa.",
      );
    } finally {
      setIsSearching(false);
    }
  }

  function handleConfirm() {
    if (!selectedPos) return;
    onConfirm(selectedPos.lat, selectedPos.lng);
    onClose();
  }

  // No renderizar nada si está cerrado — pero ver nota abajo sobre Leaflet
  if (!isOpen) return null;

  return (
    // Overlay — bloquea el mapa de fondo
    <div
      className="fixed inset-0 z-[1000] bg-black/50 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        // Cerrar al tocar el overlay, no el modal
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal — sube desde abajo en móvil, centrado en desktop */}
      <div className="bg-white w-full sm:w-[420px] rounded-t-2xl sm:rounded-2xl p-4 flex flex-col gap-3 max-h-[90vh]">
        {/* Header del modal */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-gray-800">
              Indica tu ubicación
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Tu GPS no está disponible
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Buscador de dirección */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ej: Av. Los Incas 450, Galería El Dorado…"
            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-green-600 bg-gray-50"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchText.trim()}
            className="text-xs bg-green-700 text-white px-3 py-2 rounded-lg disabled:opacity-40 hover:bg-green-800 transition-colors"
          >
            {isSearching ? "…" : "Buscar"}
          </button>
        </div>

        {searchError && <p className="text-xs text-red-500">{searchError}</p>}

        {/* Separador */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">o toca el mapa</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Mini-mapa clickeable */}
        {/*
          NOTA: altura fija obligatoria. Leaflet calcula el tamaño del
          contenedor al montar — si el div no tiene height en ese momento,
          el mapa queda en blanco. No uses h-auto aquí.
        */}
        <div className="h-52 rounded-xl overflow-hidden border border-gray-200">
          <MiniMap
            selectedPos={selectedPos}
            onMapClick={(lat, lng) => setSelectedPos({ lat, lng })}
          />
        </div>

        {/* Indicador de posición seleccionada */}
        {selectedPos ? (
          <p className="text-xs text-green-700 text-center">
            Posición marcada:{" "}
            <span className="font-medium">
              {selectedPos.lat.toFixed(5)}, {selectedPos.lng.toFixed(5)}
            </span>
          </p>
        ) : (
          <p className="text-xs text-gray-400 text-center">
            Toca el mapa para marcar dónde estás
          </p>
        )}

        {/* Botón confirmar */}
        <button
          onClick={handleConfirm}
          disabled={!selectedPos}
          className="w-full bg-green-700 text-white text-sm font-medium py-2.5 rounded-xl disabled:opacity-40 hover:bg-green-800 transition-colors"
        >
          Confirmar ubicación
        </button>
      </div>
    </div>
  );
}

export default ManualLocationModal;
