import { supabaseQuery } from "~/helper/supabaseQuery";
import type { Stop } from "~/types/stops";

export default defineEventHandler(async (event) => {
  const searchText: null | { text: string } = await readBody(event);
  const servicesResult = await supabaseQuery("unique_routes", {
    _search: searchText?.text,
  });
  let stopsResult: { data:Stop[] | null, error:any|null } = {data:null,error:null};
  if (searchText?.text.length === 5) {
    stopsResult = await supabaseQuery<Stop[]>("find_stops", {
      _code: searchText?.text,
    });
  }
  return {
    services: servicesResult.data,
    stops: stopsResult.data,
    servicesError:servicesResult.error,
    stopsError:stopsResult.error
  };
});
