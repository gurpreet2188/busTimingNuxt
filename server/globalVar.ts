import type {Stop as BUS_STOP_TYPE} from '../types/stops'

export {}
declare global {
    var stopNameHashMap: Map<string,string>
    var stopInfo:Map<string,BUS_STOP_TYPE>
}