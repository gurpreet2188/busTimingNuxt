import { busStops } from "../busStops"
import type { Stop as BUS_STOP_TYPE } from '../../types/stops'

globalThis.stopInfo = new Map()

busStops().then(d => d.forEach((obj: BUS_STOP_TYPE) => {
    // console.log('hashmap')
    return globalThis.stopInfo.set(obj.BusStopCode, obj)
}))


export default defineEventHandler(async (event)=>{
    const body =  await readBody(event)

    if(body['stopCode']) {
        const target = body['stopCode']
        const stop:BUS_STOP_TYPE|undefined = globalThis.stopInfo.get(target)  
        if(stop){
            return stop
        }
    }
})