import type {Stop as BUS_STOP_TYPE} from '../types/stops'
import { busStops } from './busStops'

// export {}
// declare global {
//     var stopNameHashMap: Map<string,string>
//     var stopInfo:Map<string,BUS_STOP_TYPE>
// }

export class HashMapSingleton {
    static instance: HashMapSingleton
    stopNameHashMap: Map<string,string>
    stopInfoHashMap:Map<string,BUS_STOP_TYPE>

    constructor() {
        this.stopNameHashMap = new Map()
        this.stopInfoHashMap = new Map()
        console.log('hashmap class')
        
    }

    async loadHashMap() {
        const busStopsList = await busStops()
        if(busStopsList) {
            busStopsList.forEach((obj: BUS_STOP_TYPE) => {
                this.stopNameHashMap.set(obj.BusStopCode, obj.Description)
                this.stopInfoHashMap.set(obj.BusStopCode, obj)
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

