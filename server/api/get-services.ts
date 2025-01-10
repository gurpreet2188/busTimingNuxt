import type { ServiceTiming, StopQuery } from "~/types/stops";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON;

export default defineEventHandler(async (event) => {
  const body: null | StopQuery = await readBody(event);
  const supabase = createClient(url!, key!);

  if (body?.single) {
    const { data } = await supabase
      .from("stop_services")
      .select("*")
      .eq("code", body?.single);
    return data as ServiceTiming[];
  }
});
