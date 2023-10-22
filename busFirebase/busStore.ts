import { _RefFirestore } from "vuefire"
import { DocumentData } from 'firebase/firestore';
interface FAVS {
    id?: string
    favs: string[]
}

export function busStore() {
    const currentUser = useCurrentUser()
    const currentUserID: Ref<string> = ref('')
    const doc: Ref<_RefFirestore<FAVS | undefined> | null> = ref(null)
    const tempFavs: Ref<string[] | []> = ref([])
    const favs: Ref<Array<string> | undefined> = useState('favs')
    async function initialize() {
        watchEffect(async () => {
            if (currentUser.value?.uid) {
                currentUserID.value = currentUser.value?.uid
                doc.value = await useReadStore(currentUserID.value)
            } else {
                currentUserID.value = ''
            }

        })

        watchEffect(() => {

            setTimeout(async ()=>{
                if (doc?.value?.value?.favs) {
                    console.log(doc.value.value?.favs)
                    if (localStorage.getItem('favs')) {
                        console.log('firestore', doc.value?.data)
                        const t = [...doc.value.value?.favs, ...JSON.parse(localStorage.getItem('favs') as string)]
                        tempFavs.value = t.filter((v: string, i: number) => t.indexOf(v) === i)
                        await useUpdateStore(currentUserID.value, tempFavs.value)
                    } else {
                        tempFavs.value = doc.value.value.favs
                    }
                } else {
                    if (localStorage.getItem('favs')) {
                        await useCreateStore(currentUserID.value, JSON.parse(localStorage.getItem('favs') as string))
                    } else {
                        await useCreateStore(currentUserID.value, [])
                    }
                }
            }, 1000)
        })

        watchEffect(() => {
            if (tempFavs.value.length > 0) {
                console.log(tempFavs)
                const tempArr = tempFavs.value.filter(v => v !== '')
                console.log(tempArr)
                localStorage.setItem('favs', JSON.stringify(tempArr))
            }
        })

        watch(tempFavs, () => {
            if (!localStorage.getItem('favs') && tempFavs.value.length > 0) {
                favs.value = tempFavs.value
                localStorage.setItem('favs', JSON.stringify(tempFavs.value))
            }
        })
    }

    async function updateStore(v: string[]) {

        if (doc.value?.data && currentUserID.value !== '') {
            return await useUpdateStore(currentUserID.value, v)
        }
    }

    return { initialize, updateStore }
}

