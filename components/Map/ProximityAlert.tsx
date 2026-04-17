"use client";

import { useEffect, useRef } from "react";

interface Zone {
  id: string;
  name: string;
  level: 1 | 2 | 3;
}

interface Props {
  zone: Zone | null;
}

export default function ProximityAlert({ zone }: Props) {
  const prevZoneRef = useRef<string | null>(null);

  useEffect(() => {
    // solo si es zona roja
    if (!zone || zone.level !== 3) {
      prevZoneRef.current = null;
      return;
    }

    // si es la misma zona → no hacer nada
    if (prevZoneRef.current === zone.id) return;

    // nueva zona roja → sonar
    playAlertSound();

    // guardar zona actual
    prevZoneRef.current = zone.id;
  }, [zone]);

  if (!zone || zone.level !== 3) return null;

  return (
    <div className="absolute top-0 left-0 w-full z-1000 flex justify-center pointer-events-none">
      <div className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
        ⚠️ {zone.name}: zona de riesgo. Cambia de ruta.
      </div>
    </div>
  );
}

// 🔊 sonido simple con Web Audio API
function playAlertSound() {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // tono agudo

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.1, ctx.currentTime); // volumen bajo

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.warn("Audio no permitido o falló:", e);
  }
}
