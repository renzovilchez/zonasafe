"use client";

import { useState, useEffect } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export default function InstallBanner() {
  const { isReadyToInstall, promptInstall } = useInstallPrompt();
  const [showBanner, setShowBanner] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Si el usuario ya lo cerró antes o si aún no está listo el prompt, no hacemos nada
    if (hasDismissed || !isReadyToInstall) return;

    // Mostrar el banner 30 segundos después de que la app esté lista para instalarse
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [isReadyToInstall, hasDismissed]);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setHasDismissed(true);
  };

  if (!showBanner || !isReadyToInstall) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-9999 md:left-auto md:right-4 md:bottom-4 md:w-96 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/90 backdrop-blur-xl border border-indigo-200 p-5 rounded-3xl shadow-2xl shadow-indigo-900/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
            ZS
          </div>
          <div className="flex-1">
            <h3 className="text-slate-800 font-bold text-lg leading-tight mb-1">
              Instala ZonaSafe
            </h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">
              Agrega la app a tu pantalla de inicio para acceder rápido al mapa
              y reportar incidentes incluso sin conexión.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-md shadow-indigo-600/20"
              >
                Instalar App
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 text-slate-500 font-medium text-sm hover:bg-slate-100 rounded-xl transition-colors"
              >
                Quizás luego
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
