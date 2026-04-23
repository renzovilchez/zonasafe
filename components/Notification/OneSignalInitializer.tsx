"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInitializer() {
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    if (!appId) {
      console.warn("OneSignal App ID no encontrado en variables de entorno.");
      return;
    }

    OneSignal.init({
      appId,
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: false,
        title: "¡Bienvenido a ZonaSafe!",
        message: "Te notificaremos sobre zonas de riesgo.",
      },
    }).then(() => {
      console.log("OneSignal inicializado correctamente");
    });
  }, []);

  return null;
}
