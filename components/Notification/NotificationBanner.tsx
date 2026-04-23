"use client";

import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";

export default function NotificationBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Solo mostrar si no hay permiso y si OneSignal está inicializado
    const checkPermission = async () => {
      try {
        const permission = await Notification.permission;
        if (permission === "default") {
          // Esperar un poco para que OneSignal se inicialice bien
          setTimeout(() => setShowBanner(true), 2000);
        }
      } catch (e) {
        console.warn("Notificaciones no soportadas", e);
      }
    };

    checkPermission();
  }, []);

  const handleEnable = async () => {
    try {
      await OneSignal.Slidedown.promptPush();
      setShowBanner(false);
    } catch (e) {
      console.error("Error al solicitar permisos:", e);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-4 md:w-96 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-4 rounded-2xl shadow-2xl shadow-slate-200/50 flex items-center gap-4">
        <div className="bg-blue-600/10 p-2.5 rounded-xl text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">
            Mantente a salvo
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Recibe alertas cuando entres en zonas de riesgo o llegues a tu
            destino.
          </p>
        </div>
        <button
          onClick={handleEnable}
          className="bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors active:scale-95"
        >
          Activar
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
