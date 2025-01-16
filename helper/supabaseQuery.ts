import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON;

export async function supabaseQuery<T>(queryFn: string, queryArgs: {}) {
  try {
    const supabase = createClient(url!, key!);
    const { data, error } = await supabase.rpc(queryFn, queryArgs);
    // console.log(data);
    error && console.error({ queryError: error });
    return data as T;
  } catch (e) {
    console.error(e);
  }
}
