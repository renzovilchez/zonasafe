import { useEffect, useRef } from "react";
import { ZoneForGeo, LatLng, distanceMeters } from "@/lib/geo";
import { Destination } from "@/components/Map/DestinationMarkers";

export function useNotificationAlerts(
  userPos: LatLng | null,
  currentZone: ZoneForGeo | null,
  selectedDestination: Destination | null,
) {
  const lastZoneId = useRef<string | null>(null);
  const reachedDestinationId = useRef<string | null>(null);

  useEffect(() => {
    // 1. Alerta de Zona Peligrosa (Nivel 3)
    if (currentZone && currentZone.level === 3) {
      if (lastZoneId.current !== currentZone.id) {
        sendNotification(
          "⚠️ Zona de Riesgo",
          `Has entrado en ${currentZone.name}. Cambia de ruta o mantente alerta.`,
        );
        lastZoneId.current = currentZone.id;
      }
    } else {
      lastZoneId.current = null;
    }
  }, [currentZone]);

  useEffect(() => {
    // 2. Alerta de Destino Cercano (< 100m)
    if (userPos && selectedDestination) {
      const distance = distanceMeters(userPos, selectedDestination);
      if (distance < 100) {
        if (reachedDestinationId.current !== selectedDestination.id) {
          sendNotification(
            "📍 Destino cercano",
            `Estás a menos de 100m de ${selectedDestination.name}.`,
          );
          reachedDestinationId.current = selectedDestination.id;
        }
      }
    } else {
      // Si cambiamos de destino o nos alejamos mucho, resetear el flag
      // pero solo si nos alejamos sustancialmente para evitar spam por jitter de GPS
      if (userPos && selectedDestination) {
        const distance = distanceMeters(userPos, selectedDestination);
        if (distance > 150) {
          reachedDestinationId.current = null;
        }
      } else {
        reachedDestinationId.current = null;
      }
    }
  }, [userPos, selectedDestination]);
}

function sendNotification(title: string, body: string) {
  if (typeof window === "undefined") return;

  if (Notification.permission === "granted") {
    // Usamos el Service Worker si está disponible para que funcione mejor en segundo plano
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        // Usamos as any para evitar el error de TypeScript con 'vibrate' y 'renotify'
        const options: any = {
          body,
          icon: "/icons/icon-192x192.png", // Ajustar según disponibilidad
          badge: "/favicon.ico",
          vibrate: [200, 100, 200],
          tag: title === "⚠️ Zona de Riesgo" ? "risk-zone" : "destination",
          renotify: true,
        };
        registration.showNotification(title, options);
      });
    } else {
      // Fallback a notificación normal
      new Notification(title, { body });
    }
  } else {
    console.warn("Permiso de notificación no otorgado.");
  }
}
