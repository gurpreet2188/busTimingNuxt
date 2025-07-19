const API_KEY: string | undefined = process.env.API_KEY;
import type { Root as BUS_INFO_TYPE } from "../../types/bus";

export default defineEventHandler(async (event) => {
  const body = JSON.parse(await readBody(event));
  let data: BUS_INFO_TYPE = { error: true };
  if (body['stopCode']) {

    const searchParams = new URLSearchParams({
      BusStopCode: body["stopCode"],
    }).toString();
    data = await $fetch(
      "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?" +
        searchParams,
      {
        headers: {
          AccountKey: API_KEY as string,
          accept: "application/json",
        },
      },
    );
    data.error = false;
    return data;
  }

  return data;
});
