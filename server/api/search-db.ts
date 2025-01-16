import { supabaseQuery } from "~/helper/supabaseQuery";
import type { Stop } from "~/types/stops";

export default defineEventHandler(async (event) => {
  const searchText: null | { text: string } = await readBody(event);
  const servicesResult = await supabaseQuery("unique_routes", {
    _search: searchText?.text,
  });
  const stopsResult = await supabaseQuery<Stop[]>("find_stops", {
    _code: searchText?.text,
  });
  return {
    services: servicesResult as { service: string }[],
    stops: stopsResult as Stop[],
  };
});
