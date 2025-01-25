export const useCreateStore = async (uid: string, v: number[]) => {
  const { doc, setDoc } = await import("firebase/firestore");
  const db = useFirestore();
  return await setDoc(doc(db, "users", uid), { favs: v });
};
