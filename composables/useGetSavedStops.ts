export default async function useGetSavedStops() {
  const savedServicesFromLocal = useState("savedServicesFromLocal");
  const user = useSupabaseUser();
  let serviceStops: string[] = [];
  //load from local storage
  serviceStops = JSON.parse(localStorage.getItem("saved")!);
  if (!serviceStops) {
    serviceStops = [];
  }
  //fetch from supabase
  if (user.value?.id) {
    const res: { data: { services_stop: string[] }; error: any } = await $fetch(
      "/api/get-saved-services-stop",
      {
        method: "POST",
        body: { id: user.value?.id },
      },
    );

    if (res.data!.services_stop.length > 0) {
      savedServicesFromLocal.value = [
        ...new Set([...res.data.services_stop, ...serviceStops]),
      ];
      localStorage.setItem(
        "saved",
        JSON.stringify(savedServicesFromLocal.value),
      );
      return;
    }
  }

  savedServicesFromLocal.value = serviceStops;
  return serviceStops;
}
