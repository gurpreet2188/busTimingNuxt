import type { CachedStops, Stop } from "../../types/stops";

export default defineEventHandler(async (event) => {
  const body: null | { lat: number; lon: number } = JSON.parse(
    await readBody(event),
  );
  let stops: Array<Stop> | [] = [];

  if (body?.hasOwnProperty("lat")) {
    let cachedData = await useStorage<CachedStops>().getItem("bus-stops");
    if (cachedData?.stops) {
      for (const [k, v] of Object.entries(cachedData?.stops)) {
        const distance = calculateDistance(
          body.lat,
          body.lon,
          v.Latitude!!,
          v.Longitude!!,
          "K",
        );
        if (distance < 0.3) {
          v["Distance"] = distance;
          stops = [...stops, v];
        }
      }

      if (stops.length === 0) {
        for (const [k, v] of Object.entries(cachedData?.stops)) {
          const distance = calculateDistance(
            body.lat,
            body.lon,
            v.Latitude!!,
            v.Longitude!!,
            "K",
          );
          if (distance < 1) {
            v["Distance"] = distance;
            stops = [...stops, v];
          }
        }
      }
      if (stops.length > 0) {
        stops.sort((a, b) => a["Distance"]!! - b["Distance"]!!);
      }
    }
  }
  // console.log(stops)
  return { stops };
});

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: string,
) {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }

  const roundNum = (num: any): number => {
    return +(Math.round(num * 100) / 100);
  };
  return roundNum(dist);
}
