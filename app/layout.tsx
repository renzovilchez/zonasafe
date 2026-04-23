import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZonaSafe — Navega seguro en El Porvenir",
  description:
    "Mapa interactivo de zonas de seguridad, mercados, fábricas y galerías de calzado en El Porvenir, Trujillo. Planifica tu ruta evitando zonas de riesgo.",
  keywords: [
    "El Porvenir",
    "Trujillo",
    "seguridad",
    "calzado",
    "mapa",
    "zonas de riesgo",
  ],
  authors: [{ name: "Renzo Vilchez" }],
  openGraph: {
    title: "ZonaSafe — Navega seguro en El Porvenir",
    description:
      "Mapa interactivo de zonas de seguridad en El Porvenir, Trujillo.",
    locale: "es_PE",
    type: "website",
  },
};

import OneSignalInitializer from "@/components/Notification/OneSignalInitializer";
import NotificationBanner from "@/components/Notification/NotificationBanner";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full">
        <OneSignalInitializer />
        <NotificationBanner />
        {children}
      </body>
    </html>
  );
}
