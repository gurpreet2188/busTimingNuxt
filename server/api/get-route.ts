import { supabaseQuery } from "~/helper/supabaseQuery";
import type { RouteWithStops } from "~/types/routes";

export default defineEventHandler(async (event) => {
  const body: null | { service: string; direction: number } =
    await readBody(event);
  return await supabaseQuery<RouteWithStops[]>("find_routes_stops", {
    _service: body?.service.toUpperCase(),
    _direction: body?.direction,
  });
});
