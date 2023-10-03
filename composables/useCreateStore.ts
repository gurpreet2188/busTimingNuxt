import { doc, setDoc } from "firebase/firestore";

export const useCreateStore = async (uid: string, v: number[]) => {
    const db = useFirestore()
    return await setDoc(doc(db, 'users', uid), { favs: v })
}