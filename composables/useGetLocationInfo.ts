import type { Geocode } from "~/types/geocode";

export default async function useGetLocationInfo(
  lat: number,
  lon: number,
): Promise<Geocode | undefined> {
  const runtime = useRuntimeConfig();
  const app = useNuxtApp();
  const query = new URLSearchParams({
    key: runtime.public.GMAP_KEY! as string,
    result_type: "establishment",
    location_type: "rooftop",
    latlng: `${lat},${lon}`,
  }).toString();
  const { data, error } = await useFetch(
    "https://maps.googleapis.com/maps/api/geocode/json?" + query,
    {
      method: "POST",
      key: (lat + lon).toString(),
      getCachedData(key) {
        const data = app.payload.data[key] || app.static.data[key];
        if (!data) return;
        if (data) return data;
      },
    },
  );

  if (data) return data.value as Geocode;
  if (error) return undefined;
}
