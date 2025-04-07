import type { ServiceTiming } from "~/types/stops";
import { supabaseQuery } from "../utils/supabaseQuery";

export default defineEventHandler(async (event) => {
  const body: { code: string } | null = await readBody(event);
  return await supabaseQuery<ServiceTiming>(event, "find_services", {
    _code: body?.code,
  });
});
