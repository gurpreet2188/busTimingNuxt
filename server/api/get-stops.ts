import type { Stop, StopQuery } from "~/types/stops";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON;
export default defineEventHandler(
  async (event): Promise<Stop[] | Stop | any> => {
    const body: null | StopQuery = await readBody(event);
    const supabase = createClient(url!, key!);
    try {
      if (body?.nearest) {
        const { data, error } = await supabase.rpc("find_nearest_stops", {
          lat: body?.nearest?.lat,
          lon: body?.nearest?.lon,
        });
        return data as Stop[];
      }
      if (body?.single) {
        const { data, error } = await supabase
          .from("stops")
          .select("*")
          .eq("code", body?.single);
        return data![0] as Stop;
      }

      if (body?.name) {
        const { data, error } = await supabase
          .from("stops")
          .select("street")
          .eq("code", body?.single);
        return data![0]?.street as string;
      }
    } catch (e) {
      console.error(e);
      return e;
    }
  },
);
