export default async function useGetBusRoute(
  bus: string,
  stop: string,
  origin: string,
  destination: string,
) {
  const routeOne = await $fetch("/api/get-route", {
    method: "POST",
    body: { service: bus, direction: 1 },
  });

  if (origin === destination) {
    for (let r = 0; r <= Math.round(routeOne.data?.length! / 2); r++) {
      if (routeOne.data![r].code === stop) {
        return routeOne.data!.slice(0, routeOne.data?.length! / 2);
      }
    }
    for (
      let r = Math.round(routeOne.data?.length! / 2);
      r <= routeOne.data?.length! - 1;
      r++
    ) {
      if (routeOne.data![r].code === stop) {
        return routeOne.data!.slice(
          routeOne.data?.length! / 2,
          routeOne.data?.length! - 1,
        );
      }
    }
  }

  for (const r of routeOne.data!) {
    if (r.code === stop) {
      return routeOne.data!;
    }
  }

  const routeTwo = await $fetch("/api/get-route", {
    method: "POST",
    body: { service: bus, direction: 2 },
  });

  return routeTwo.data!;
}
