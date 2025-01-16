import { supabaseQuery } from "~/helper/supabaseQuery";

export default defineEventHandler(async (event) => {
  const body: { lat: number; lon: number } | null = await readBody(event);
  return await supabaseQuery("find_nearest_stops", {
    lat: body!.lat,
    lon: body!.lon,
  });
});
