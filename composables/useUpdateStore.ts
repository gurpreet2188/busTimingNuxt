import { doc, setDoc, updateDoc } from "firebase/firestore";

export const useUpdateStore = async (uid: string, v: string[]) => {
    const db = useFirestore()
    return await updateDoc(doc(db, 'users', uid), { favs: v })
}