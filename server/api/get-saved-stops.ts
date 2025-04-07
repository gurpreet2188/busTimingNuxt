import { supabaseQuery } from "../utils/supabaseQuery";

export default defineEventHandler(async (event) => {
  const body: null | { id: string } = await readBody(event);
  return await supabaseQuery(event, "get_saved_stops", { _id: body?.id });
});
