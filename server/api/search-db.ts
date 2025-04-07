import type { Stop } from "~/types/stops";
import { supabaseQuery } from "../utils/supabaseQuery";

export default defineEventHandler(async (event) => {
  const searchText: null | { text: string } = await readBody(event);
  const servicesResult = await supabaseQuery(event, "unique_routes", {
    _search: searchText?.text,
  });
  let stopsResult: { data: Stop[] | null; error: any | null } = {
    data: null,
    error: null,
  };
  if (searchText?.text.length === 5) {
    stopsResult = await supabaseQuery<Stop[]>(event, "find_stops", {
      _code: searchText?.text,
    });
  }
  return {
    services: servicesResult.data,
    stops: stopsResult.data,
    servicesError: servicesResult.error,
    stopsError: stopsResult.error,
  };
});
