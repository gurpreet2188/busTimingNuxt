import type {
  LTAStop,
  Stop,
  CachedStops,
  StopQueryResponse,
  StopQuery,
} from "~/types/stops";
const API_KEY: string | undefined = process.env.API_KEY;

export default defineEventHandler(async (event) => {
  const body: null | StopQuery = await readBody(event);
  const response: StopQueryResponse = {};

  //get all stops
  const isCached = await useStorage<CachedStops>().hasItem("bus-stops");
  let cachedData = await useStorage<CachedStops>().getItem("bus-stops");
  if (!isCached || cachedData === null) {
    cachedData = {
      error: false,
      created: new Date().toString(),
      stops: await getAllStops(),
    };
    await useStorage<CachedStops>().setItem("bus-stops", cachedData);
  }
  // console.log(Object.keys(cachedData?.stops).length)
  // find nearst
  if (body?.nearest) {
    return {
      stops: getNearestStops(
        cachedData.stops!!,
        body?.nearest.lat,
        body?.nearest.lon,
      ),
    };
  }

  // find single
  if (body?.single) {
    return {
      stop: cachedData.stops!![body?.single],
    };
  }

  // find name
  if (body?.name) {
    return {
      name: cachedData.stops!![body?.name].Description,
    };
  }

  return response;
});

async function getAllStops() {
  let skip = 0;
  let stops: { [key: string]: Stop } = {};
  while (true) {
    const searchParams = new URLSearchParams({ $skip: `${skip}` }).toString();
    const res = await fetch(
      "http://datamall2.mytransport.sg/ltaodataservice/BusStops?" +
        searchParams,
      {
        headers: {
          AccountKey: API_KEY as string,
          accept: "application/json",
        },
      },
    );
    const resJSON = await res.json();
    if (!resJSON["value"]) {
      break;
    }
    if (resJSON.value instanceof Array === false) {
      break;
    }
    if (resJSON.value.length === 0) {
      break;
    }
    try {
      // data = [...data, ...(await resJSON.value)];
      console.log(resJSON.value.length);
      resJSON.value.forEach((v: LTAStop) => {
        stops[v.BusStopCode] = {
          BusStopCode: v.BusStopCode,
          Description: v.Description,
          RoadName: v.RoadName,
          Latitude: v.Latitude,
          Longitude: v.Longitude,
        };
      });
    } catch (err) {
      console.log(err);
      break;
    }
    skip += 500;
  }
  return stops;
}

function getNearestStops(
  stops: { [key: string]: Stop },
  lat: number,
  lon: number,
) {
  let foundStops: Array<Stop> | [] = [];
  for (const [k, v] of Object.entries(stops)) {
    const distance = calculateDistance(
      lat,
      lon,
      v.Latitude!!,
      v.Longitude!!,
      "K",
    );
    if (distance < 0.3) {
      v["Distance"] = distance;
      foundStops = [...foundStops, v];
    }
  }

  if (foundStops.length === 0) {
    for (const [k, v] of Object.entries(stops)) {
      const distance = calculateDistance(
        lat,
        lon,
        v.Latitude!!,
        v.Longitude!!,
        "K",
      );
      if (distance < 1) {
        v["Distance"] = distance;
        foundStops = [...foundStops, v];
      }
    }
  }
  if (foundStops.length > 0) {
    foundStops.sort((a, b) => a["Distance"]!! - b["Distance"]!!);
  }

  return foundStops;
}

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
