"use client";

import { useState, useEffect, useCallback } from "react";
import { getOfflineReports, syncOfflineReports } from "@/lib/syncManager";

export function useBackgroundSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const updatePendingCount = useCallback(async () => {
    const reports = await getOfflineReports();
    setPendingCount(reports.length);
  }, []);

  const triggerSync = useCallback(async () => {
    if (!navigator.onLine) return;
    
    setIsSyncing(true);
    try {
      const synced = await syncOfflineReports();
      if (synced > 0) {
        // Podríamos mostrar una notificación nativa o toast aquí
        console.log(`Se sincronizaron ${synced} reportes en segundo plano.`);
      }
    } finally {
      await updatePendingCount();
      setIsSyncing(false);
    }
  }, [updatePendingCount]);

  useEffect(() => {
    // Estado inicial
    setIsOnline(navigator.onLine);
    updatePendingCount();
    
    // Intentar sincronizar al cargar si hay red
    if (navigator.onLine) {
      triggerSync();
    }

    // Listeners
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Revisar la cola periódicamente por si acaso
    const interval = setInterval(() => {
      updatePendingCount();
    }, 10000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [triggerSync, updatePendingCount]);

  return { isOnline, isSyncing, pendingCount, triggerSync, updatePendingCount };
}
