import { supabaseQuery } from "~/helper/supabaseQuery";

export default defineEventHandler(async (event) => {
  const body: null | { id: string; stops: string[] } = await readBody(event);
  return await supabaseQuery(event, "update_profile_stops", {
    _id: body?.id,
    _stops: body?.stops,
  });
});
