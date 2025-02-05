import { serverSupabaseClient } from "#supabase/server";

import { H3Event } from "h3";
export async function supabaseQuery<T>(
  event: H3Event | null = null,
  queryFn: string,
  queryArgs: {},
): Promise<{ data: T | null; error: any | null }> {
  try {
    const supabase = await serverSupabaseClient(event!!);
    const { data, error } = await supabase.rpc(queryFn, queryArgs);
    error && console.error({ queryError: error });
    return { data: data, error: error?.message };
  } catch (e) {
    console.log(e);
    return { data: null, error: e };
  }
}
