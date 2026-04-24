import { get, set } from "idb-keyval";

export interface ReportDraft {
  id: string; // ID local temporal
  lat: number;
  lng: number;
  description: string;
  createdAt: number;
}

const REPORTS_STORE_KEY = "offline-reports";

/**
 * Guarda un reporte en IndexedDB cuando no hay conexión.
 */
export async function saveReportOffline(report: Omit<ReportDraft, "id" | "createdAt">) {
  const currentReports = (await get<ReportDraft[]>(REPORTS_STORE_KEY)) || [];
  
  const newReport: ReportDraft = {
    ...report,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  currentReports.push(newReport);
  await set(REPORTS_STORE_KEY, currentReports);
  
  return newReport;
}

/**
 * Obtiene todos los reportes pendientes de sincronizar.
 */
export async function getOfflineReports() {
  return (await get<ReportDraft[]>(REPORTS_STORE_KEY)) || [];
}

/**
 * Intenta enviar todos los reportes guardados localmente a la API.
 * Retorna el número de reportes sincronizados exitosamente.
 */
export async function syncOfflineReports() {
  if (typeof window === "undefined" || !navigator.onLine) return 0;

  const reports = await getOfflineReports();
  if (reports.length === 0) return 0;

  let syncedCount = 0;
  const remainingReports: ReportDraft[] = [];

  for (const report of reports) {
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: report.lat,
          lng: report.lng,
          description: report.description,
        }),
      });

      if (response.ok) {
        syncedCount++;
      } else {
        // Falló por error del servidor, se mantiene en la cola
        remainingReports.push(report);
      }
    } catch (e) {
      // Falló por red (sigue offline), se mantiene en la cola
      remainingReports.push(report);
    }
  }

  // Actualiza la cola solo con los que fallaron
  await set(REPORTS_STORE_KEY, remainingReports);
  
  return syncedCount;
}
