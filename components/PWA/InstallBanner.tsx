"use client";
import { useState, useEffect } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export default function InstallBanner() {
  const { isReadyToInstall, promptInstall } = useInstallPrompt();
  const [showBanner, setShowBanner] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    if (hasDismissed || !isReadyToInstall) return;
    const timer = setTimeout(() => setShowBanner(true), 30000);
    return () => clearTimeout(timer);
  }, [isReadyToInstall, hasDismissed]);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) setShowBanner(false);
  };
  const handleDismiss = () => { setShowBanner(false); setHasDismissed(true); };

  if (!showBanner || !isReadyToInstall) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-9999 safe-bottom flex justify-center pointer-events-none" style={{ animation: "slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <div className="w-full mx-3 md:max-w-sm mb-3 bg-white/95 backdrop-blur-xl border border-[#185FA5]/10 rounded-xl shadow-lg shadow-[#185FA5]/10 overflow-hidden pointer-events-auto">
        <div className="flex items-center gap-2.5 px-3.5 py-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#185FA5] to-[#1a6bb8] shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-[#185FA5]/30">ZS</div>
          <p className="flex-1 text-xs text-slate-600 leading-snug">Instala ZonaSafe para acceso rápido sin conexión.</p>
          <button onClick={handleInstall} className="bg-[#185FA5] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg hover:bg-[#1a6bb8] active:scale-95 transition-all shrink-0">Instalar</button>
          <button onClick={handleDismiss} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
