import type { _RefFirestore } from "vuefire";

export default async function useFavStop(stopCode: string, addNew: boolean) {
  const currentUser = useCurrentUser().value && useCurrentUser().value?.uid;
  const favStopsFromLocal: Ref<string[] | null> = useState("favs");
  console.log(favStopsFromLocal.value, "favs");
  if (favStopsFromLocal.value && !addNew) {
    for (let i = 0; i <= favStopsFromLocal.value.length - 1; i++) {
      if (favStopsFromLocal.value[i] === stopCode) {
        localStorage.removeItem("favs");
        favStopsFromLocal.value.splice(i, 1);
        localStorage.setItem("favs", JSON.stringify(favStopsFromLocal.value));
        if (currentUser) {
          await useUpdateStore(currentUser!, favStopsFromLocal.value);
        }
        break;
      }
    }
  }

  if (
    favStopsFromLocal.value &&
    addNew &&
    !favStopsFromLocal.value.includes(stopCode)
  ) {
    favStopsFromLocal.value.push(stopCode);
    localStorage.removeItem("favs");
    localStorage.setItem("favs", JSON.stringify(favStopsFromLocal.value));
    console.log(favStopsFromLocal.value, "favs");
    if (currentUser) {
      await useUpdateStore(currentUser!, favStopsFromLocal.value);
    }
  }
}
