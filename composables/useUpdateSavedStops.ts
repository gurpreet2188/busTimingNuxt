export default async function useUpdateSavedStops(
  service: string,
  stop: string,
) {
  const user = useSupabaseUser();
  const savedServicesFromLocal = useState("savedServicesFromLocal");
  const serviceStops = updateLocalStorage(`${service}-${stop}`);
  if (user.value?.id && serviceStops) {
    const res: { data: boolean; error: any } = await $fetch(
      "/api/update-saved-services-stop",
      {
        method: "POST",
        body: { id: user.value?.id, serviceStops: serviceStops },
      },
    );
    if (res.error) {
      updateLocalStorage(`${service}-${stop}`);
      return false;
    }
    savedServicesFromLocal.value = serviceStops;
    return res.data;
  }
  savedServicesFromLocal.value = JSON.parse(localStorage.getItem("saved")!);
  return true;
}

function updateLocalStorage(servicesStop: string) {
  if (!localStorage.getItem("saved")) {
    localStorage.setItem("saved", JSON.stringify([]));
  }
  const localSaved: string[] = JSON.parse(localStorage.getItem("saved")!);
  let servicesStops: null | string[] = null;
  if (localSaved && localSaved.includes(servicesStop)) {
    servicesStops = localSaved.filter((s) => s !== servicesStop);
    localStorage.setItem("saved", JSON.stringify(servicesStops));
  } else if (localSaved) {
    servicesStops = [...localSaved, servicesStop];
    localStorage.setItem("saved", JSON.stringify(servicesStops));
  }
  return servicesStops;
}
