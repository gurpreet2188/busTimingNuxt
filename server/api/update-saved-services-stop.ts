import { supabaseQuery } from "../utils/supabaseQuery";

export default defineEventHandler(async (event) => {
  const body: null | { id: string; serviceStops: string[] } =
    await readBody(event);
  console.log(body);
  return await supabaseQuery(event, "update_profile_services_stop", {
    _id: body?.id,
    _services_stop: body?.serviceStops,
  });
});
