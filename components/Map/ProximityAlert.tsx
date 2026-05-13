"use client";
import { useEffect, useRef, useState } from "react";

interface Zone { id: string; name: string; level: 1 | 2 | 3; }
interface Props { zone: Zone | null; }

export default function ProximityAlert({ zone }: Props) {
  const prevZoneRef = useRef<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!zone || zone.level !== 3) { prevZoneRef.current = null; setVisible(false); return; }
    if (prevZoneRef.current === zone.id) return;
    playAlertSound();
    setVisible(true);
    prevZoneRef.current = zone.id;
    const timer = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timer);
  }, [zone]);

  if (!visible) return null;
  return (
    <div
      className="absolute top-0 left-0 right-0 z-1000 flex justify-center pointer-events-none safe-top"
      style={{ animation: "slide-down 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div
        className="mt-16 mx-4 bg-gradient-to-r from-[#E24B4A] to-[#c92f2e] text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-[#E24B4A]/30 flex items-center gap-3 max-w-sm w-full"
        style={{ animation: "banner-alert 0.6s ease-in-out 0.2s" }}
      >
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-lg">⚠️</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-tight">{zone?.name}</p>
          <p className="text-[13px] text-red-100 leading-tight mt-0.5">Zona de riesgo. Cambia de ruta.</p>
        </div>
      </div>
    </div>
  );
}

function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = "sine"; osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
    osc.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  } catch (e) { console.warn("Audio no permitido o falló:", e); }
}
