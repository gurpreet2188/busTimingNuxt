import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON;
if (!url || !key) {
  throw new Error("Missing Supabase environment variables.");
}

export async function supabaseQuery<T>(
  queryFn: string,
  queryArgs: {},
): Promise<{ data: T | null; error: any | null }> {
  try {
    const supabase = createClient(url!, key!);
    const { data, error } = await supabase.rpc(queryFn, queryArgs);
    // console.log(data);
    error && console.error({ queryError: error });
    return { data: data, error: error?.message };
  } catch (e) {
    return { data: null, error: e };
  }
}
