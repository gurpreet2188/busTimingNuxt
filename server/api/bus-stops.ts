const API_KEY: string | undefined = process.env.API_KEY;

export async function busStopsFromStore() {
  let skip = 0;
  let data: Array<object> = [];
  const isCached = await useStorage().hasItem("bus-stops");
  // const cachedData = useStorage().getItem("bus-stops");
  if (!isCached) {
    while (true) {
      const searchParams = new URLSearchParams({ $skip: `${skip}` }).toString();
      const res = await fetch(
        "http://datamall2.mytransport.sg/ltaodataservice/BusStops?" +
          searchParams,
        {
          headers: {
            AccountKey: API_KEY as string,
            accept: "application/json",
          },
        },
      );
      const resJSON = await res.json();
      if (resJSON["value"]) {
        if (resJSON.value instanceof Array) {
          try {
            data = [...data, ...(await resJSON.value)];
          } catch (err) {
            console.log(err);
            break;
          }
          if (resJSON.value.length === 0) {
            break;
          }
          skip += 500;
        } else {
          break;
        }
      } else {
        break;
      }
      break;
    }
    await useStorage().setItem("bus-stops", {
      created: new Date().toString(),
      data: data,
    });
  }

  return await useStorage().getItem("bus-stops");
}
