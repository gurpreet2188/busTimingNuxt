import { createClient } from "@supabase/supabase-js";
import type { Stop } from "~/types/stops";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON;

export default defineEventHandler(async (event) => {
  try {
    const supabase = createClient(url!, key!);
    const searchText: null | { text: string } = await readBody(event);
    if (searchText) {
      const servicesResult = await supabase.rpc("unique_routes", {
        _search: searchText?.text,
      });
      const stopsResult = await supabase
        .from("stops")
        .select("street,code,description")
        .ilike("find_in_stops", `%${searchText?.text}%`);
      return {
        services: servicesResult.data as { service: string }[],
        stops: stopsResult.data as Stop[],
      };
    }
  } catch (e) {
    console.error(e);
  }
});
