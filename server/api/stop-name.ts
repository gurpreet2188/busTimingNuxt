import { busStops } from "../busStops"
import type { Root as BUS_STOP_TYPES, Stop as BUS_STOP_TYPE } from '../../types/stops'


globalThis.stopNameHashMap = new Map<string, string>()


// if(busStopsList) {
busStops().then(d => d.forEach((obj: BUS_STOP_TYPE) => {
    return globalThis.stopNameHashMap.set(obj.BusStopCode, obj.Description)
}))

// }

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

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
        const stop = globalThis.stopNameHashMap.get(targetStop)
        return { 'name': stop }
    }
})