import { doc, getDoc } from "firebase/firestore";
import type { QueryDocumentSnapshot, WithFieldValue } from "firebase/firestore";

interface FAVS {
  id?: string;
  favs: string[];
}

export const useReadStore = (uid: string = "") => {
  const db = useFirestore();
  const user = useCurrentUser();

  // const converter = <T>() => ({
  //   toFirestore: (data: WithFieldValue<T>) => data,
  //   fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
  // });
  // const docs = reactive(
  //   useDocument(doc(db, "users", uid).withConverter(converter<FAVS>())),
  // );

  const stops = useDocument(doc(db, "users", user.value?.uid!));
  return reactive(stops);
};
