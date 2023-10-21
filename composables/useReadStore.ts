import { doc } from "firebase/firestore"
import type {QueryDocumentSnapshot, WithFieldValue } from 'firebase/firestore'


interface FAVS {
    id?: string
    favs: string[]
}

export const useReadStore = async (uid: string) => {
    const db = useFirestore()
    const converter = <T>() => ({
        toFirestore: (data: WithFieldValue<T>) => data,
        fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T
    })
    return useDocument(doc(db, 'users', uid).withConverter(converter<FAVS>()))
}