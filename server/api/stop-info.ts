import { HashMapSingleton } from "../busInfoHashMap"

const hashmap = HashMapSingleton.getInstance()


export default defineEventHandler(async (event)=>{
    const body =  await readBody(event)

    if(body['stopCode']) {
        if(hashmap.stopInfoHashMap.size === 0) {
            await hashmap.loadHashMap()
        }

        const target = body['stopCode']
        // const stop:BUS_STOP_TYPE|undefined = globalThis.stopInfo.get(target)  
        const stop = hashmap.stopInfoHashMap.get(target)
        if(stop){
            return stop
        }
    }
})