import type { NEAWeather } from "~/types/weather";

export default defineEventHandler(
  async (event): Promise<String | undefined> => {
    try {
      const body: { lat: number; lon: number } = await readBody(event);
      const f = await fetch(
        "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast",
      );
      const d: NEAWeather = await f.json();
      if (!d.errorMsg) {
        let range = 0.5;
        let distances: { area: string; dis: number }[] = [];
        for (let i = 0; i <= d.data.area_metadata.length - 1; i++) {
          const distance = calculateDistance(
            body.lat,
            body.lon,
            d.data.area_metadata[i].label_location.latitude,
            d.data.area_metadata[i].label_location.longitude,
          );
          if (distance <= range) {
            for (const n of d.data.items[0].forecasts) {
              if (n.area === d.data.area_metadata[i].name) {
                console.log(n.area);
                return n.forecast;
              }
            }
          }
          distances.push({ area: d.data.area_metadata[i].name, dis: distance });
        }
        range += 0.5;
        for (let i = 0; i <= distances.length - 1; i++) {
          if (distances[i].dis <= range) {
            return d.data.items[0].forecasts.filter(
              (v) => v.area === distances[i].area,
            )[0].forecast;
          }
          if (i === distances.length - 1) {
            range += 0.5;
            i = 0;
          }
          if (range > 4) {
            break;
          }
        }

        return undefined;
      }
    } catch (error: any) {
      return undefined;
    }
  },
);

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  // Radius of the Earth in kilometers
  const R = 6371;

  // Convert latitude and longitude from degrees to radians
  const lat1Rad = lat1 * (Math.PI / 180);
  const lon1Rad = lon1 * (Math.PI / 180);
  const lat2Rad = lat2 * (Math.PI / 180);
  const lon2Rad = lon2 * (Math.PI / 180);

  // Differences in coordinates
  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distance = R * c;

  return distance;
}
