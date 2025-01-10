import { createClient } from "@supabase/supabase-js";
import type { RouteWithStops } from "~/types/routes";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON;

export default defineEventHandler(async (event) => {
  try {
    const supabase = createClient(url!, key!);
    const body: null | { service: string; direction: number } =
      await readBody(event);
    const { data, error } = await supabase.rpc("find_routes_stops", {
      _service: body?.service.toUpperCase(),
      _direction: body?.direction,
    });
    return data as RouteWithStops[];
  } catch (e) {
    console.error(e);
  }
});
