import { supabaseQuery } from "~/helper/supabaseQuery";
import type { Stop } from "~/types/stops";

export default defineEventHandler(async (event) => {
  const body: null | { embedding: string } = await readBody(event);
  return {
    stops: await supabaseQuery<Stop[]>("similarity_street_description", {
      query_embedding: `[${body!.embedding}]`,
      match_threshold: 0.81,
      match_count: 10,
    }),
  };
});
