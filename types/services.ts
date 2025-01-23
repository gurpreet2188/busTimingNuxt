import type { Stop } from "./stops";

export interface Root {
  value: Value[];
}

export interface Value {
  ServiceNo: string;
  Operator: string;
  Direction: number;
  StopSequence: number;
  BusStopCode: string;
  Distance: number;
  WD_FirstBus: string;
  WD_LastBus: string;
  SAT_FirstBus: string;
  SAT_LastBus: string;
  SUN_FirstBus: string;
  SUN_LastBus: string;
}

export interface ServiceWithStops extends Stop {
  service: string;
  code: string;
  direction: number;
  sequence: number;
  distance: number;
  wd_first: string;
  wd_last: string;
  sat_first: string;
  sat_last: string;
  sun_first: string;
  sun_last: string;
  second_direction: boolean;
}

export interface StoredValues {
  StopSequence: number;
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  Distance: number;
  WD_FirstBus: string;
  WD_LastBus: string;
  SAT_FirstBus: string;
  SAT_LastBus: string;
  SUN_FirstBus: string;
  SUN_LastBus: string;
}

export interface RestructuredServices {
  ServiceNo: string;
  Operator: string;
  fromStart: { [key: string]: StoredValues };
  fromEnd: { [key: string]: StoredValues };
}
