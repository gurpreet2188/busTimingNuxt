import type { LTAStop, Stop, CachedStops } from "~/types/stops";

const API_KEY: string | undefined = process.env.API_KEY;
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));
  let skip = 0;
  let stops: { [key: string]: Stop } = {};
  const isCached = await useStorage<CachedStops>().hasItem("bus-stops");
  let cachedData = await useStorage<CachedStops>().getItem("bus-stops");
  console.log(isCached);
  if (!isCached || !cachedData?.created) {
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
      if (resJSON["value"]) {
        if (resJSON.value instanceof Array) {
          try {
            // data = [...data, ...(await resJSON.value)];
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
            cachedData = { error: true };
            console.log(err);
            break;
          }
          if (resJSON.value.length === 0) {
            break;
          }
          skip += 500;
        } else {
          break;
        }
      } else {
        break;
      }
      // await timer(500);
    }
    await useStorage<CachedStops>().setItem("bus-stops", {
      error: false,
      created: new Date().toString(),
      stops: stops,
    });
  }
  console.log((await useStorage<CachedStops>().getItem("bus-stops"))?.created);
  return (await useStorage<CachedStops>().getItem("bus-stops"))?.stops!![
    body["stopCode"]
  ]!!;
});
