"use client";
import { useEffect, useState } from "react";

export default function NotificationBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") setTimeout(() => setShowBanner(true), 5000);
  }, []);

  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") new Notification("¡Notificaciones activadas!", { body: "Alertas de ZonaSafe activadas.", icon: "/icons/icon-192.png" });
      setShowBanner(false);
    } catch (e) { console.error(e); }
  };

  if (!showBanner) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-9999 safe-top flex justify-center pointer-events-none" style={{ animation: "slide-down 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <div className="w-full mx-3 md:max-w-sm mt-3 bg-white/95 backdrop-blur-xl border border-[#185FA5]/10 rounded-xl shadow-lg shadow-black/5 overflow-hidden pointer-events-auto">
        <div className="flex items-center gap-2.5 px-3.5 py-3">
          <div className="bg-[#185FA5]/10 p-1.5 rounded-lg shrink-0">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#185FA5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </div>
          <p className="flex-1 text-xs text-slate-600 leading-snug">Recibe alertas de zonas de riesgo y destino cercano.</p>
          <button onClick={handleEnable} className="bg-[#185FA5] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg hover:bg-[#1a6bb8] active:scale-95 transition-all shrink-0">Activar</button>
          <button onClick={() => setShowBanner(false)} className="text-slate-300 hover:text-slate-500 transition-colors shrink-0">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
