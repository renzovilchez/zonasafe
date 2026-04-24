"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import { saveReportOffline } from "@/lib/syncManager";

function ReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isOnline, triggerSync } = useBackgroundSync();

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "getting_gps" | "success">("idle");

  useEffect(() => {
    // Si viene desde el mapa por long-press
    const urlLat = searchParams.get("lat");
    const urlLng = searchParams.get("lng");

    if (urlLat && urlLng) {
      setLat(parseFloat(urlLat));
      setLng(parseFloat(urlLng));
    } else {
      // Entró directo a la página, pedir GPS
      setStatus("getting_gps");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setStatus("idle");
        },
        (err) => {
          console.warn("GPS denegado", err);
          alert("Necesitamos tu ubicación para hacer un reporte preciso.");
          setStatus("idle");
        },
        { enableHighAccuracy: true }
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lng) {
      alert("Esperando señal GPS...");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isOnline) {
        throw new Error("offline");
      }

      // Intentar online
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng, description }),
      });

      if (!response.ok) {
        throw new Error("server error");
      }

      setStatus("success");
    } catch (error) {
      // Fallback offline ( IndexedDB )
      console.log("Guardando en modo offline...");
      await saveReportOffline({ lat, lng, description });
      // Forzar un intento de sync para que se encole o notifique
      triggerSync();
      setStatus("success");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 bg-slate-50">
        <div className="bg-white/80 backdrop-blur-xl border border-emerald-200 p-8 rounded-3xl shadow-2xl text-center max-w-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Reporte Guardado</h2>
          <p className="text-slate-600 mb-6">
            {!isOnline
              ? "No tienes conexión. El reporte se enviará automáticamente cuando recuperes la señal."
              : "Tu reporte ha sido enviado y registrado exitosamente."}
          </p>
          <button
            onClick={() => router.push("/mapa")}
            className="w-full bg-slate-800 text-white font-medium py-3 rounded-xl hover:bg-slate-700 transition"
          >
            Volver al Mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-slate-800">Reportar Incidente</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 max-w-md w-full mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50">
          {!isOnline && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
              <span>⚠️</span>
              Estás desconectado. El reporte se guardará localmente.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Ubicación del incidente
              </label>
              <div className="bg-slate-100 px-4 py-3 rounded-xl text-slate-500 text-sm font-mono flex justify-between items-center">
                {status === "getting_gps" || (!lat && !lng) ? (
                  <span className="animate-pulse">Obteniendo coordenadas GPS...</span>
                ) : (
                  <>
                    <span>Lat: {lat?.toFixed(5)}</span>
                    <span>Lng: {lng?.toFixed(5)}</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="¿Qué sucedió? Ej. Robo, accidente, zona oscura..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !lat || !lng}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:active:scale-100 mt-2"
            >
              {isSubmitting ? "Guardando..." : "Enviar Reporte"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando formulario...</div>}>
      <ReportForm />
    </Suspense>
  );
}
