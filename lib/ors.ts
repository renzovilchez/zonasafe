import routesDataRaw from "@/data/routes.json";
import { Route } from "@/types";

const routesData = routesDataRaw as Route[];

export async function getRoute(
  start: [number, number],
  end: [number, number],
): Promise<Route | null> {
  const apiKey = process.env.ORS_API_KEY;

  if (!apiKey) {
    console.warn("Usando rutas estáticas (fallback)");
    return getClosestRoute(start);
  }

  try {
    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [
            [start[1], start[0]],
            [end[1], end[0]],
          ],
        }),
      },
    );

    if (!res.ok) throw new Error("ORS error");

    const data = await res.json();

    return {
      id: "ors",
      name: "Ruta ORS",
      coordinates: data.features[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng],
      ),
    };
  } catch (error) {
    console.error("ORS falló, usando fallback:", error);
    return getClosestRoute(start);
  }
}

function getClosestRoute(start: [number, number]): Route {
  let closest = routesData[0];
  let minDist = Infinity;

  for (const route of routesData) {
    const [lat, lng] = route.coordinates[0];

    const dist = Math.sqrt(
      Math.pow(lat - start[0], 2) + Math.pow(lng - start[1], 2),
    );

    if (dist < minDist) {
      minDist = dist;
      closest = route;
    }
  }

  return closest;
}
