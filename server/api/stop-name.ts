import { busStops } from "../busStops"
import type { Root as BUS_STOP_TYPES, Stop as BUS_STOP_TYPE } from '../../types/stops'
import { HashMapSingleton } from "../globalVar"


globalThis.stopNameHashMap = new Map<string, string>()

const hashmap = HashMapSingleton.getInstance()



// if(busStopsList) {
busStops().then(d => d.forEach((obj: BUS_STOP_TYPE) => {
    // hashmap.stopNameHasMap.set(obj.BusStopCode, obj.Description)
    return globalThis.stopNameHashMap.set(obj.BusStopCode, obj.Description)
}))


// console.log(hashmap.stopNameHasMap, 'class')
// }

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if(hashmap.stopNameHasMap.size === 0) {
        await hashmap.loadHashMap()
    }
    if (body['stopCode']) {
        // const busStopsList:BUS_STOP_TYPE[] = await busStops()
        // if(busStopsList) {
        //     for (const stop of busStopsList) {
        //         if(stop['BusStopCode']===body['stopCode']) {
        //             return {'name':stop.Description}
        //         }
        //     }
        // }
        const targetStop = body['stopCode']
        // const stop = globalThis.stopNameHashMap.get(targetStop)
        const stop = hashmap.stopNameHasMap.get(targetStop)
        return { 'name': stop }
    }
})