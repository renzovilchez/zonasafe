"use client";

import { useEffect, useState, useCallback } from "react";

export default function OfflineGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<{
    isOnline: boolean;
    hasCache: boolean;
    isChecking: boolean;
  }>({
    isOnline: true,
    hasCache: false,
    isChecking: true,
  });

  const checkStatus = useCallback(async () => {
    setStatus((prev) => ({ ...prev, isChecking: true }));

    let isOnline = false;
    let hasCache = false;

    try {
      // 1. Heartbeat Check
      // Intentamos una petición ligera para confirmar internet real
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      try {
        const response = await fetch("/favicon.ico", {
          method: "HEAD",
          cache: "no-store",
          signal: controller.signal,
        });
        isOnline = response.ok;
      } catch {
        isOnline = false;
      } finally {
        clearTimeout(timeoutId);
      }

      // 2. Cache Verification
      // Verificamos si existen los caches necesarios para el mapa
      const cacheNames = await caches.keys();
      const hasTiles = cacheNames.includes("osm-tiles");
      const hasApi = cacheNames.includes("api-data");

      if (hasTiles && hasApi) {
        const tileCache = await caches.open("osm-tiles");
        const tiles = await tileCache.keys();
        const apiCache = await caches.open("api-data");
        const apis = await apiCache.keys();
        hasCache = tiles.length > 0 && apis.length > 0;
      }
    } catch (error) {
      console.error("OfflineGuard: Error verificando estado:", error);
    }

    setStatus({
      isOnline,
      hasCache,
      isChecking: false,
    });
  }, []);

  useEffect(() => {
    checkStatus();

    const handleOnline = () => {
      // Si volvemos a estar online, re-verificamos todo
      checkStatus();
    };

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkStatus]);

  if (status.isChecking) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
        <div className="relative flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
            Configurando entorno...
          </p>
        </div>
      </div>
    );
  }

  // Solo bloqueamos si NO hay internet Y NO hay datos cacheados
  if (!status.isOnline && !status.hasCache) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="mb-8 relative">
          <div className="absolute -inset-4 rounded-full bg-blue-100/50 blur-xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl shadow-blue-100/50">
            <svg
              className="h-12 w-12 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900">
          Fuera de línea
        </h1>
        <p className="mb-10 max-w-sm text-lg text-slate-600 leading-relaxed">
          No detectamos conexión a internet ni datos guardados localmente para
          mostrar el mapa.
        </p>

        <button
          onClick={checkStatus}
          className="group relative flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 active:scale-95 shadow-lg shadow-blue-100"
        >
          <svg
            className="h-5 w-5 transition-transform group-hover:rotate-180 duration-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reintentar conexión
        </button>

        <div className="mt-8 flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          Modo Offline Protegido
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
        </div>
      </div>
    );
  }

  // Si hay internet O hay caché, permitimos el acceso al mapa
  return <>{children}</>;
}
