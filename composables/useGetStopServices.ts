import type { ServiceTiming } from "~/types/stops";
import { useStorage } from "@vueuse/core";
export default async function useGetStopServices(
  code: string,
): Promise<string[] | undefined> {
  const cachedServices: Ref<{ [key: string]: string[] }> = useStorage(
    "stopServices",
    {},
  );
  if (cachedServices.value[code]) {
    return cachedServices.value[code];
  }
  const services: { data: ServiceTiming[]; error: any } = await $fetch(
    "/api/get-services",
    {
      method: "POST",
      body: { code: code },
    },
  );

  if (services.data) {
    const tempServices = [];
    for (const service of services.data) {
      tempServices.push(service.service);
    }
    cachedServices.value = { ...cachedServices.value, [code]: tempServices };
    return tempServices;
  }
  return undefined;
}
