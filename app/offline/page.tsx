"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      {/* Ícono de sin señal */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
        <svg
          className="h-10 w-10 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-slate-900">Sin conexión</h1>

      <p className="mb-2 max-w-sm text-slate-600">
        Abre ZonaSafe con conexión al menos una vez para usarla offline.
      </p>

      <p className="mb-6 max-w-sm text-sm text-slate-500">
        El mapa y los datos de zonas seguras se guardarán automáticamente en tu
        dispositivo.
      </p>

      <Link
        href="/mapa"
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-95"
      >
        Reintentar
      </Link>

      <p className="mt-4 text-xs text-slate-400">ZonaSafe — El Porvenir</p>
    </main>
  );
}
