import type { Stop as BUS_STOP_TYPE } from "../types/stops";
import type { Root as BUS_INFO_TYPES } from "../types/bus";

export const fetchPOST = async (url: string, body: object) => {
  try {
    const data = await fetch(import.meta.env["VITE_APP_BASE_URL"] + url, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return await data.json();
  } catch (e) {
    console.error(e);
  }
};

export const fetchData = async (stops: BUS_STOP_TYPE[]) => {
  if (stops.length > 0) {
    for (const stop of stops) {
      const tempInfo: BUS_INFO_TYPES = await fetchPOST("/api/bus-info", {
        stopCode: stop.BusStopCode,
      });
      if (Object.keys(tempInfo).includes("Services")) {
        if (stop.BusStopCode === tempInfo.BusStopCode) {
          stop.Services = tempInfo.Services;
          // if (stop.Services) {
          //     if (stop.Services.length > 0) {
          //         for (const service of stop.Services) {

          //             const tempOrigin: { name: string } = await fetchPOST('/api/stop-name', { 'stopCode': service.NextBus.OriginCode })
          //             const tempDestination: { name: string } = await fetchPOST('/api/stop-name', { 'stopCode': service.NextBus.DestinationCode })
          //             if (tempOrigin['name'] && tempDestination['name']) {
          //                 service.NextBus.Origin = tempOrigin['name']
          //                 service.NextBus.Destination = tempDestination['name']
          //             }
          //         }
          //     }
          // }
        }
      }
    }
  }
  // console.log(stops)
  return { stops: stops };
};
