import type { _RefFirestore } from "vuefire";
import { useStorage } from "@vueuse/core";
import { getDoc, doc } from "firebase/firestore";
interface FAVS {
  id?: string;
  favs: string[];
}

export function busStore() {
  const userDoc: Ref<FAVS | null> = ref(null);
  const favStopsFromLocal: Ref<string[] | null> = useState("favs");
  async function initialize(uid: string = "") {
    const db = useFirestore();
    userDoc.value = (await getDoc(doc(db, "users", uid))).data() as FAVS;
    if (toRaw(userDoc.value).favs) {
      checkForFavsInLocalStorage(toRaw(userDoc.value).favs, uid);
    }
  }

  async function checkTotalSavedStops(uid:string):Promise<number>{
    const db = useFirestore();
    const saved = (await getDoc(doc(db, "users", uid))).data() as FAVS;
    return saved.favs.length
  }

  async function checkForFavsInLocalStorage(
    favsFromStore: string[],
    uid: string,
  ) {
    favStopsFromLocal.value = null;
    if (!localStorage.getItem("favs")) {
      favStopsFromLocal.value = favsFromStore;
      useStorage("favs", JSON.stringify(favsFromStore));
      // localStorage.setItem("favs", JSON.stringify(favsFromStore));
      return;
    }

    const localFavs: string[] = JSON.parse(
      localStorage.getItem("favs") as string,
    );

    const combinedFavs = [...new Set([...localFavs, ...favsFromStore])];
    localStorage.removeItem("favs");
    useStorage("favs", JSON.stringify(combinedFavs));
    favStopsFromLocal.value = combinedFavs;
    if (localFavs.toString() === favsFromStore.toString()) {
      console.log("not pushing");
      return;
    }
    console.log("pushing");
    return await useUpdateStore(uid, combinedFavs);
  }

  function loadFromLocaStorage() {
    if (!localStorage.getItem("favs")) {
      useStorage("favs", JSON.stringify([]));
      return;
    }

    favStopsFromLocal.value = JSON.parse(
      localStorage.getItem("favs") as string,
    );
  }
  return { initialize, loadFromLocaStorage };
}
