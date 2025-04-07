import type { Stop } from "~/types/stops";
import { supabaseQuery } from "../utils/supabaseQuery";

export default defineEventHandler(async (event) => {
  const body: null | { embedding: string } = await readBody(event);
  return await supabaseQuery<Stop[]>(event, "similarity_street_description", {
    query_embedding: `[${body!.embedding}]`,
    match_threshold: 0.81,
    match_count: 50,
  });
});
