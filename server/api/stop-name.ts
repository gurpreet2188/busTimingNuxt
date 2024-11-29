import { HashMapSingleton } from "../busInfoHashMap";

const hashmap = HashMapSingleton.getInstance();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let name: string = "";
  if (hashmap.stopNameHashMap.size === 0) {
    await hashmap.loadHashMap();
  }
  if (body["stopCode"]) {
    // const busStopsList:BUS_STOP_TYPE[] = await busStops()
    // if(busStopsList) {
    //     for (const stop of busStopsList) {
    //         if(stop['BusStopCode']===body['stopCode']) {
    //             return {'name':stop.Description}
    //         }
    //     }
    // }
    const targetStop = body["stopCode"];
    const stop = hashmap.stopNameHashMap.get(targetStop);
    name = stop!!;
  }
  return name;
});
