export const useReadStore = async (uid: string = "") => {
  const { doc } = await import("firebase/firestore");
  const db = useFirestore();
  const user = useCurrentUser();

  const stops = useDocument(doc(db, "users", user.value?.uid!));
  return reactive(stops);
};
