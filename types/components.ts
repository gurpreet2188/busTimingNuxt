export interface COMPONENT_STATE {
  [key: string]: boolean;
  // welcome: boolean;
  // loadBusInfo: boolean;
  // loading: boolean;
  // login: boolean;
}

export enum ComponentsStateKeys {
  WELCOME = "welcome",
  LOADBUSINFO = "loadBusInfo",
  LOCATIONLOADING = "locationLoading",
  LOADING = "loading",
  LOGIN = "login",
}

export enum SubComponentStateKeys {
  LOCATION = "location",
  FAVS = "favs",
  ROUTE = "route",
  LOADING = "loading",
}
