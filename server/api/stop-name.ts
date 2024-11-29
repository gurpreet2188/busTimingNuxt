import type { CachedStops } from "~/types/stops";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let name: string = "";
  if (body["stopCode"]) {
    const targetStop = body["stopCode"];
    const stop = (await useStorage<CachedStops>().getItem("bus-stops"))
      ?.stops!![targetStop].Description;
    name = stop!!;
  }
  return name;
});
