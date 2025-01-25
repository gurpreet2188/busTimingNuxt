interface FAVS {
  id?: string;
  favs: string[];
}
export default async function useCheckTotalStops(uid: string): Promise<number> {
  const { doc, getDoc } = await import("firebase/firestore");
  const db = useFirestore();
  const saved = (await getDoc(doc(db, "users", uid))).data() as FAVS;
  return saved.favs.length;
}
