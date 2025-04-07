import type { ServiceWithStops } from "~/types/services";
import { supabaseQuery } from "../utils/supabaseQuery";

export default defineEventHandler(async (event) => {
  const body: null | { service: string; direction: number } =
    await readBody(event);
  return await supabaseQuery<ServiceWithStops[]>(event, "find_routes_stops", {
    _service: body?.service.toUpperCase(),
    _direction: body?.direction,
  });
});
