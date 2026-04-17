import MapContainer from "@/components/Map/MapContainer";

async function getZones() {
  try {
    const res = await fetch("http://localhost:3000/api/zones", {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Error API");

    return await res.json();
  } catch (error) {
    console.warn("Fallback zones desde server:", error);
    const zones = await import("@/data/zones.json");
    return zones.default;
  }
}

export default async function MapaPage() {
  const zones = await getZones();

  return (
    <main className="w-full h-screen">
      <MapContainer zones={zones} />
    </main>
  );
}
