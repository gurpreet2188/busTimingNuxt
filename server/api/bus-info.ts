const API_KEY: string | undefined = process.env.API_KEY
import { busStops } from "../busStops"
import type {Root as BUS_INFO_TYPE} from '../../types/bus'

const findStopName = async (stopCode:string) => {
    const busStopsList = await busStops()

    if(busStopsList) {
        for(const stop of busStopsList) {
            if(stop['BusStopCode'] === stopCode) {
                return stop['Description']
            }
        }
    }

    return ''
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if(body['stopCode']) {
        const searchParams = new URLSearchParams({'BusStopCode': body['stopCode']}).toString()
        const res = await fetch('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?' + searchParams,{headers: { 'AccountKey': API_KEY as string, 'accept': 'application/json' }})
        const data:BUS_INFO_TYPE = await res.json()
        if('BusStopCode' in data) {
            data.Services[0].NextBus.Destination = await findStopName(data.Services[0].NextBus.DestinationCode)
            data.Services[0].NextBus.Origin = await findStopName(data.Services[0].NextBus.OriginCode)
        }
        return data
    }
    
   
})