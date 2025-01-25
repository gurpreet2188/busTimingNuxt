export const useUpdateStore = async (uid: string, v: string[]) => {
  const { doc, updateDoc } = await import("firebase/firestore");
  const db = useFirestore();
  return await updateDoc(doc(db, "users", uid), { favs: v });
};
