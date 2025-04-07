import type { ServiceTiming } from "~/types/stops";

export default async function useGetFirstLastBus(
  stopCode: string,
  busService: string,
  day: string,
): Promise<{ first: string; last: string } | undefined> {
  const routeInfo: ServiceTiming[] | null = await $fetch("/api/get-services", {
    method: "POST",
    body: { code: stopCode },
  });
  if (routeInfo) {
    // return {first:routeInfo[0].}
  }
  return undefined;
}
