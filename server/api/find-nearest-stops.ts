import { busStops } from "../busStops"
import type {Stop as BUS_STOP_TYPE} from '../../types/stops'

export default defineEventHandler(async (event) => {
    const body: null | { lat: number, lon: number } = await readBody(event)
    let stops:Array<BUS_STOP_TYPE>| [] = []
    if (body && body['lat']) {
        const busStopsList = await busStops()

        if (busStopsList) {
            stops  = []
            for (const stop of busStopsList) {
                const distance = calculateDistance(body.lat, body.lon, stop.Latitude, stop.Longitude, 'K')
                if( distance < 0.4) {
                    stop['Distance'] = distance
                    stops = [...stops, stop]
                }
            }

            if(stops.length >0) {
                stops.sort((a,b)=> a['Distance'] - b['Distance'])
            }
        }
    }
    // console.log(stops)
    return { stops }
})

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string) {
    const radlat1 = Math.PI * lat1 / 180
    const radlat2 = Math.PI * lat2 / 180
    const theta = lon1 - lon2
    const radtheta = Math.PI * theta / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }

    const roundNum = (num: any): number => {
        return +(Math.round(num * 100) / 100)
    }
    return roundNum(dist)
}