export interface Root {
  stops: Stop[];
}

export interface CachedStops {
  error: boolean;
  created?: string;
  stops?: { [key: string]: Stop };
}
export interface LTAStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}

export interface Stop {
  code: string;
  street: string;
  description: string;
  lattitude: number;
  longitude: number;
  distance: number;
  services: RealtimeService[];
}

export interface RealtimeService {
  ServiceNo: string;
  Operator: string;
  NextBus: NextBus;
  NextBus2: NextBus;
  NextBus3: NextBus;
}

export interface NextBus {
  OriginCode: string;
  Origin: string;
  DestinationCode: string;
  Destination: string;
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: string;
  Feature: string;
  Type: string;
}

export interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
}

export interface BusStopsCached {
  created: string;
  stops: BusStop[];
}

export interface RestructuredStops {
  BusStopCode: string;
  RoadName: string;
  LowerCaseRoadName: string;
  Description: string;
  LowerCaseDescription: string;
  Latitude: number;
  Longitude: number;
  Services: string[];
  Service: { [key: string]: StopService };
}

export interface ServiceTiming {
  service: string;
  code: string;
  wd_first: string;
  wd_last: string;
  sat_first: string;
  sat_last: string;
  sun_first: string;
  sun_last: string;
}

export interface StopService {
  ServiceNo: string;
  WD_FirstBus: string;
  WD_LastBus: string;
  SAT_FirstBus: string;
  SAT_LastBus: string;
  SUN_FirstBus: string;
  SUN_LastBus: string;
}

export interface StopQuery {
  nearest?: { lat: number; lon: number };
  single?: string;
  name?: string;
}

export interface StopQueryResponse {
  stops?: Stop[];
  stop?: Stop;
  name?: string;
}
