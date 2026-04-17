"use client";

interface Zone {
  id: string;
  name: string;
  level: 1 | 2 | 3;
}

interface Props {
  zone: Zone | null;
}

export default function ProximityAlert({ zone }: Props) {
  if (!zone || zone.level !== 3) return null;

  return (
    <div className="absolute top-0 left-0 w-full z-1000 flex justify-center pointer-events-none">
      <div className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
        ⚠️ ¡Precaución! Estás entrando a una zona de riesgo. Cambia de ruta.
      </div>
    </div>
  );
}
