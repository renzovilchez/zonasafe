import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#185FA5",
};

export const metadata: Metadata = {
  title: "ZonaSafe — Navega seguro en El Porvenir",
  description: "Mapa interactivo de zonas de seguridad, mercados, fábricas y galerías de calzado en El Porvenir, Trujillo. Planifica tu ruta evitando zonas de riesgo.",
  keywords: ["El Porvenir", "Trujillo", "seguridad", "calzado", "mapa", "zonas de riesgo"],
  authors: [{ name: "Renzo Vilchez" }],
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "ZonaSafe" },
  openGraph: { title: "ZonaSafe — Navega seguro en El Porvenir", description: "Mapa interactivo de zonas de seguridad en El Porvenir, Trujillo.", locale: "es_PE", type: "website" },
};

import NotificationBanner from "@/components/Notification/NotificationBanner";
import InstallBanner from "@/components/PWA/InstallBanner";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full">
        <NotificationBanner />
        <InstallBanner />
        {children}
      </body>
    </html>
  );
}
