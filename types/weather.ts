export interface NEAWeather {
  code: number;
  data: Data;
  errorMsg: string;
}

export interface Data {
  area_metadata: AreaMetadaum[];
  items: Item[];
}

export interface AreaMetadaum {
  name: string;
  label_location: LabelLocation;
}

export interface LabelLocation {
  latitude: number;
  longitude: number;
}

export interface Item {
  update_timestamp: string;
  timestamp: string;
  valid_period: ValidPeriod;
  forecasts: Forecast[];
}

export interface ValidPeriod {
  start: string;
  end: string;
  text: string;
}

export interface Forecast {
  area: string;
  forecast: string;
}
