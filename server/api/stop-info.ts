import type { Stop } from "~/types/stops";
import { HashMapSingleton } from "../busInfoHashMap";

export default defineEventHandler(async (event) => {
  const hashmap = HashMapSingleton.getInstance();
  const body = await readBody(event);
  let data: Stop = { error: true };
  if (body["stopCode"]) {
    if (hashmap.stopInfoHashMap.size === 0) {
      await hashmap.loadHashMap();
    }

    const target = body["stopCode"];
    // const stop:BUS_STOP_TYPE|undefined = globalThis.stopInfo.get(target)
    const stop = hashmap.stopInfoHashMap.get(target);
    if (stop) {
      data = stop;
      data.error = false;
    }
  }
  return data;
});
