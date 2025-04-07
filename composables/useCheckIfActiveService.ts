import type { RealtimeService } from "~/types/stops";

export default function useCheckIfActiveService(
  services: RealtimeService[],
  service: string,
): boolean {
  if (services.length === 0) {
    return false;
  }
  for (const rs of services) {
    if (rs.ServiceNo === service) {
      return true;
    }
  }
  return false;
}
