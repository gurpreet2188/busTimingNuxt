export default async function useGetSavedStops() {
  const savedStopsFromLocal = useState("savedStopsFromLocal");
  const user = useSupabaseUser();
  let stops: string[] = [];
  //load from local storage
  stops = JSON.parse(localStorage.getItem("saved")!);
  if (!stops) {
    stops = [];
  }
  //fetch from supabase
  if (user.value?.id) {
    const res: { data: { stops: string[] }; error: any } = await $fetch(
      "/api/get-saved-stops",
      {
        method: "POST",
        body: { id: user.value?.id },
      },
    );

    if (res.data!.stops.length > 0) {
      savedStopsFromLocal.value = [...new Set([...res.data.stops, ...stops])];
      localStorage.setItem("saved", JSON.stringify(savedStopsFromLocal.value));
      return;
    }
  }

  savedStopsFromLocal.value = stops;
  return stops;
}
