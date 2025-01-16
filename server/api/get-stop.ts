import { supabaseQuery } from "~/helper/supabaseQuery";
import type { Stop } from "~/types/stops";

export default defineEventHandler(async (event) => {
  const body: { code: string } | null = await readBody(event);
  return (await supabaseQuery<Stop[]>("find_stop", {
    _code: body?.code,
  }))![0];
});
