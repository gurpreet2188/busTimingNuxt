import {doc, getDoc} from "firebase/firestore";
interface FAVS {
    id?: string;
    favs: string[];
}
export default async function useCheckTotalStops(uid: string): Promise<number> {
    const db = useFirestore();
    const saved = (await getDoc(doc(db, "users", uid))).data() as FAVS;
    return saved.favs.length
}