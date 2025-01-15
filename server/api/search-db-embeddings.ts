import { createClient } from "@supabase/supabase-js";
import type { Stop } from "~/types/stops";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON;

export default defineEventHandler(async (event) => {
  try {
    const supabase = createClient(url!, key!);
    const body: null | { embedding: string } = await readBody(event);
    if (body) {
      const stopsResult = await supabase.rpc("similarity_street_description", {
        query_embedding: `[${body.embedding}]`,
        match_threshold: 0.81,
        match_count: 10,
      });
      return {
        stops: stopsResult.data as Stop[],
      };
    }
  } catch (e) {
    console.error(e);
  }
});
