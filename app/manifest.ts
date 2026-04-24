import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZonaSafe — El Porvenir",
    short_name: "ZonaSafe",
    description: "Navega seguro en El Porvenir, Trujillo",
    start_url: "/mapa",
    display: "standalone",
    background_color: "#185FA5",
    theme_color: "#185FA5",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
