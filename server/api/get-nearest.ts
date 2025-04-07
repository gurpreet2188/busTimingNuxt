import { supabaseQuery } from "../utils/supabaseQuery";
export default defineEventHandler(async (event) => {
  const body: { lat: number; lon: number } | null = await readBody(event);
  return await supabaseQuery(event, "find_nearest_stops", {
    lat: body!.lat,
    lon: body!.lon,
  });
});
