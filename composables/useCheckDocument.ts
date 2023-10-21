import { collection, doc} from "firebase/firestore"


export const useCheckStore = async (uid:string)=> {
    const db = useFirestore()
    const getDoc = useDocument(doc(collection(db, 'users'), uid))
    // return await getDoc.value

}