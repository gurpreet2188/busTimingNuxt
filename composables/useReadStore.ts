import { collection, doc } from "firebase/firestore"


export const useReadStore = async (uid:string)=> {
    const db = useFirestore()
    return useDocument(doc(collection(db, 'users'), uid))
}