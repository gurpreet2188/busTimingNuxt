import { supabaseQuery } from "~/helper/supabaseQuery";
import type { ServiceTiming } from "~/types/stops";

export default defineEventHandler(async (event) => {
  const body: { code: string } | null = await readBody(event);
  return await supabaseQuery<ServiceTiming>(event, "find_services", {
    _code: body?.code,
  });
});
