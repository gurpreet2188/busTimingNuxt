export interface Root {
  stops: Stop[];
}

export interface Stop {
  error: boolean;
  BusStopCode?: string;
  RoadName?: string;
  Description?: string;
  Latitude?: number;
  Longitude?: number;
  Services?: Service[];
  Distance?: number;
}

export interface Service {
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
  Description: string;
  Latitude: number;
  Longitude: number;
  Services: string[];
  Service: { [key: string]: StopService };
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
