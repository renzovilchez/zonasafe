import type { NextConfig } from "next";

const withPWA = require("next-pwa");

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev,
  runtimeCaching: [
    {
      // Tiles de OpenStreetMap (Leaflet por defecto)
      urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "osm-tiles",
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      // Datos de la API
      urlPattern: /\/api\/(zones|destinations|reports).*/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "api-data",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
    {
      // Assets estáticos
      urlPattern: /\/(icons|images|_next\/static)\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
    {
      // Almacenamiento de Supabase (Imágenes de reportes)
      urlPattern:
        /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "supabase-storage",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      // Páginas de la app
      urlPattern: /^https:\/\/.*\/(mapa|destinos|reportar|perfil).*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
  ],
  // Se eliminaron los fallbacks automáticos para manejarlos via componentes (OfflineGuard)

})({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cpwulabjetssifdfftoa.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  transpilePackages: ["leaflet", "react-leaflet", "leaflet-arrowheads"],
  experimental: {
    typedRoutes: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  turbopack: isDev ? {} : undefined,
});

export default nextConfig;
