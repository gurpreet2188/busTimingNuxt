export default async function useUpdateSavedStops(stop: string) {
  const user = useSupabaseUser();
  const savedStopsFromLocal = useState("savedStopsFromLocal");
  const stops = updateLocalStorage(stop);

  if (user.value?.id && stops) {
    const res: { data: boolean; error: any } = await $fetch(
      "/api/update-saved-stops",
      {
        method: "POST",
        body: { id: user.value?.id, stops: stops },
      },
    );

    if (res.error) {
      updateLocalStorage(stop);
      return false;
    }
    savedStopsFromLocal.value = stops;
    return res.data;
  }
  savedStopsFromLocal.value = JSON.parse(localStorage.getItem("saved")!);
  return true;
}

function updateLocalStorage(stop: string) {
  if (!localStorage.getItem("saved")) {
    localStorage.setItem("saved", JSON.stringify([]));
  }
  const localSaved: string[] = JSON.parse(localStorage.getItem("saved")!);
  let stops: null | string[] = null;
  if (localSaved && localSaved.includes(stop)) {
    stops = localSaved.filter((s) => s !== stop);
    localStorage.setItem("saved", JSON.stringify(stops));
  } else if (localSaved) {
    stops = [...localSaved, stop];
    localStorage.setItem("saved", JSON.stringify(stops));
  }
  return stops;
}
