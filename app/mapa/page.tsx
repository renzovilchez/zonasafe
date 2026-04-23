import { supabase } from "@/lib/supabase";
import zonesJson from "@/data/zones.json";
import MapContainer from "@/components/Map/MapContainer";

async function getZones() {
  const { data, error } = await supabase.from("zones").select("*");
  if (error || !data?.length) return zonesJson;
  return data;
}

export default async function MapaPage() {
  const zones = await getZones();
  return (
    <main className="flex-1 min-h-0">
      <MapContainer zones={zones} />
    </main>
  );
}
