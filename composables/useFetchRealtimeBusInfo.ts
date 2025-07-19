import type { RealtimeService } from "~/types/stops";

export default async function useFetchRealtimeBusInfo(
  stopCode: string,
): Promise<RealtimeService[]> {
  const res = await fetch("/api/bus-info", {
    method: "POST",
    body: JSON.stringify({ stopCode: stopCode }),
  });
  const data = await res.json()

  if (!data.error) {
    for (const service of data.Services!) {
      if (service.NextBus) {
        const origin = await useGetCachedStopInfo(service.NextBus.OriginCode);
        service.NextBus.Origin = origin?.description!;
        const destination = await useGetCachedStopInfo(
          service.NextBus.DestinationCode,
        );
        service.NextBus.Destination = destination?.description!;
      }
    }
    return data.Services!!;
  }
  return [];
}
