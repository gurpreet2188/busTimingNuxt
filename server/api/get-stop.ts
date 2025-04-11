import type { Stop } from "~/types/stops";
import { supabaseQuery } from "../utils/supabaseQuery";

export default defineEventHandler(async (event) => {
  const body: { code: string } | null = await readBody(event);
  return await supabaseQuery<Stop[]>(event, "find_stop", {
    _code: body!.code,
  });
});
