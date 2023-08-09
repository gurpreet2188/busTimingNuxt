import { busStops } from "../busStops"

export default defineEventHandler(async (event)=>{
    const body =  await readBody(event)

    if(body['stopCode']) {
        const busStopsList = await busStops()

        if(busStopsList) {
            for(const stop of busStopsList) {
                if(stop['BusStopCode'] === body['stopCode']) {
                    return {'name':stop['Description']}
                }
            }
        }
    }
})