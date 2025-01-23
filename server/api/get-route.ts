import { supabaseQuery } from "~/helper/supabaseQuery";
import type { ServiceWithStops } from "~/types/services";

export default defineEventHandler(async (event) => {
  const body: null | { service: string; direction: number } =
    await readBody(event);
  return await supabaseQuery<ServiceWithStops[]>("find_routes_stops", {
    _service: body?.service.toUpperCase(),
    _direction: body?.direction,
  });
});
