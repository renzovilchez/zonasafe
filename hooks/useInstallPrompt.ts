"use client";

import { useState, useEffect } from "react";

// Extendemos el tipo Window para incluir el evento de instalación
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isReadyToInstall, setIsReadyToInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevenir que el navegador muestre el banner mini-infobar por defecto
      e.preventDefault();
      // Guardar el evento para dispararlo luego
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsReadyToInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    // Mostrar el prompt nativo de instalación
    await deferredPrompt.prompt();

    // Esperar a ver qué responde el usuario
    const { outcome } = await deferredPrompt.userChoice;
    
    // Una vez usado, el prompt ya no sirve, lo limpiamos
    setDeferredPrompt(null);
    setIsReadyToInstall(false);

    return outcome === "accepted";
  };

  return { isReadyToInstall, promptInstall };
}
