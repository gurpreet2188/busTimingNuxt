export interface Root {
    "odata.metadata": string
    BusStopCode: string
    Services: Service[]
  }
  
  export interface Service {
    ServiceNo: string
    Operator: string
    NextBus: NextBus
    NextBus2: NextBus
    NextBus3: NextBus
  }
  
  export interface NextBus {
    OriginCode: string
    Origin: string
    DestinationCode: string
    Destination:string
    EstimatedArrival: string
    Latitude: string
    Longitude: string
    VisitNumber: string
    Load: string
    Feature: string
    Type: string
  }
  
