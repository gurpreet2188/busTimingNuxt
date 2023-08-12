import type {Stop as BUS_STOP_TYPE} from '../types/stops'
import { busStops } from './busStops'

export {}
declare global {
    var stopNameHashMap: Map<string,string>
    var stopInfo:Map<string,BUS_STOP_TYPE>
}

export class HashMapSingleton {
    static instance: HashMapSingleton
    stopNameHasMap: Map<string,string>

    constructor() {
        this.stopNameHasMap = new Map()
        console.log('hashmap class')
        
    }

    async loadHashMap() {
        const busStopsList = await busStops()
        if(busStopsList) {
            busStopsList.forEach((obj: BUS_STOP_TYPE) => {
                return this.stopNameHasMap.set(obj.BusStopCode, obj.Description)
            })  
        }
    }

    static getInstance(): HashMapSingleton {
        if(!HashMapSingleton.instance) {
            HashMapSingleton.instance = new HashMapSingleton()
        }
        return HashMapSingleton.instance
    }
   
}

