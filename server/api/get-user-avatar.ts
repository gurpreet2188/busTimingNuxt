import { supabaseQuery } from "~/helper/supabaseQuery";

export default defineEventHandler(async (event) => {
  const body: null | { id: string } = await readBody(event);
  return supabaseQuery(event, "find_user_avatar", { _id: body?.id });
});
