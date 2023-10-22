<script setup lang="ts">
import { _AsyncData } from 'nuxt/dist/app/composables/asyncData';
import { _RefFirestore, useCurrentUser } from 'vuefire';
import type { Root as BUS_STOP_TYPES, Stop as BUS_STOP_TYPE } from './types/stops';
import { fetchData } from './helper/fetchData'
import { useGeolocation } from '@vueuse/core'
import * as firebaseui from 'firebaseui';
import { busStore } from './busFirebase/busStore'



const getData = async (pos: { lat: number, lon: number }) => {

    const res = await fetch(`${import.meta.env['VITE_APP_BASE_URL']}/api/find-nearest-stops`, { method: 'POST', body: JSON.stringify(pos) })
    const data = await res.json()
    return await data
}

const loadBusInfo: Ref<boolean> = useState('loadBusInfo', () => false)
const { coords, locatedAt, error, resume, pause } = useGeolocation()
const busStoreInstance = busStore()
// const firebaseUi: Ref<firebaseui.auth.AuthUI> = useState('firebaseUi')
const firebaseUi = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(useFirebaseAuth())
const waitForLogin: Ref<boolean> = useState('waitForLoing', () => false)
const loggedIn: Ref<boolean> = useState('loggedIn', () => false)
const skipLogIn: Ref<boolean> = useState('skipLogIn', () => false)
const welcomePage: Ref<boolean> = useState('welcomePage', () => false)
const loginPage: Ref<boolean> = useState('loginPage', () => true)
const loadingPage: Ref<boolean> = useState('loadingPage', () => false)
const settings: Ref<boolean> = useState('settings', () => false)
const currentUser = useCurrentUser()
// const favStopsFirestore: Ref<any | null> = useState('favStopsFirestore', () => null)
const favsStops: Ref<BUS_STOP_TYPES | null> = useState('favsStops', () => null)
const filterFavs: Ref<Boolean> = useState('filterFavs', () => false)
const favs: Ref<Array<string> | undefined> = useState('favs', () => undefined)
const stops: Ref<BUS_STOP_TYPES> = ref({ stops: [] })
const darkTheme: Ref<boolean> = useState('darkTheme', () => false)
// const localStorageLocation: Ref<{ lat: number, lon: number } | null> = ref(null)
const location: Ref<{ lat: number, lon: number } | null> = ref(null)
const windowBlur: Ref<boolean> = ref(false)
const bodyOverFlow: Ref<string> = ref('overflow:auto')

watch(settings, () => {
    if (settings.value) {
        bodyOverFlow.value = 'overflow:hidden'
    } else {
        bodyOverFlow.value = 'overflow:auto'
    }
})
useHead({ bodyAttrs: { class: 'bg-[#ffcdb2] dark:bg-[#0d1b2a] min-h-full', style: bodyOverFlow }, htmlAttrs: { class: 'min-h-full' } })

onMounted(async () => {
    favs.value = localStorage.getItem('favs') && JSON.parse(localStorage.getItem('favs') as string)
    // if (localStorage.getItem('location')) {
    //     localStorageLocation.value = JSON.parse(localStorage.getItem('location') as string)
    // }

    darkTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        darkTheme.value = e.matches
    })

    window.addEventListener('blur', (e) => {

        windowBlur.value = true
    })

    window.addEventListener('focus', (e) => {

        windowBlur.value = false
    })


})

const mainInterval: Ref<NodeJS.Timer | null> = ref(null)
const favsInterval: Ref<NodeJS.Timer | null> = ref(null)

watch(windowBlur, () => {
    const timeout = setTimeout(() => {
        if (favsInterval.value && windowBlur.value) {
            clearInterval(favsInterval.value)
        }

        if (mainInterval.value && windowBlur.value) {
            clearInterval(mainInterval.value)
        }
    }, 60000)

    if (!windowBlur.value) {
        if (timeout) {
            clearTimeout(timeout)
        }

    }

})

watch(favs, async () => {
    let tempfavStops: BUS_STOP_TYPES = { stops: [] }
    if (favs.value) {
        if ((favs.value?.length > 0) && process.client) {
            for (const stop of favs.value) {
                const res = await fetch('/api/stop-info', { method: 'POST', body: JSON.stringify({ 'stopCode': stop }) })
                const data: BUS_STOP_TYPE = await res.json()
                if (data['BusStopCode']) {
                    tempfavStops.stops = [...tempfavStops.stops, data]
                }
            }

            if (tempfavStops.stops.length > 0) {
                fetchData(tempfavStops.stops).then(d => favsStops.value = d)
                favsInterval.value = setInterval(() => {
                    fetchData(tempfavStops.stops).then(d => favsStops.value = d)
                }, 60000)
            }
        } else {
            favsStops.value = { stops: [] }
        }
    }
})

watch(favs, () => {
    if (favsInterval.value) {
        clearInterval(favsInterval.value)
    }
})


watchEffect(async () => {

    if (coords.value.latitude !== Infinity && coords.value.longitude !== Infinity) {
        pause()
        // window.localStorage.setItem('location', JSON.stringify({ lat: coords.value.latitude, lon: coords.value.longitude }))
        location.value = { lat: coords.value.latitude, lon: coords.value.longitude }
    }

})

// watchEffect(() => {
//     setTimeout(async () => {
//         if (currentUser?.value?.uid) {
//             loadingPage.value = true
//             welcomePage.value = false
//             loggedIn.value = true
//             // favStopsFirestore.value = await useReadStore(currentUser.value.uid)
//             //    setTimeout(()=>{

//             //    },500)

//         } else {
//             welcomePage.value = true
//             loadingPage.value = false
//         }
//     }, 1000)
//     if(currentUser) {
//         console.log(currentUser)
//     }

// })

watchEffect(() => {
    if (firebaseUi?.isPendingRedirect()) {
        loginPage.value = true
        welcomePage.value = false
        loadingPage.value = false
        loggedIn.value = false
        waitForLogin.value = true
    } else {
        loginPage.value = false
        if (currentUser?.value?.uid) {
            loadingPage.value = true
            welcomePage.value = false
            loggedIn.value = true
            // favStopsFirestore.value = await useReadStore(currentUser.value.uid)
            //    setTimeout(()=>{

            //    },500)

        } else {
            welcomePage.value = true
            loadingPage.value = false
        }
    }
}
)

// watchEffect(() => {
//     if (favStopsFirestore.value) {
//         console.log(favStopsFirestore.value)
//         console.log(currentUser?.value?.uid, favStopsFirestore.value)
//     }
// })

watchEffect(() => {
    const loadData = async (lat: number, lon: number) => {
        stops.value = await getData({ lat: lat, lon: lon })
       
        if (stops.value.stops.length > 0) {
            stops.value = await fetchData(stops.value.stops)

            mainInterval.value = setInterval(async () => {

                stops.value = await fetchData(stops.value.stops)
            }, 60000)

            loadBusInfo.value = true
            loadingPage.value = false

        }
    }
    
    if (location.value && !welcomePage.value && (loggedIn.value || skipLogIn.value)) {
        // sample loc
        // loadData(1.331230, 103.838949) 
        loadData(location.value.lat, location.value.lon)
    }
    // if (localStorageLocation.value) {
    //     loadData(localStorageLocation.value.lat, localStorageLocation.value.lon)
    // } else if (location.value && localStorageLocation.value) {
    //     if (location.value !== localStorageLocation.value) {
    //         loadData(location.value.lat, location.value.lon)
    //     }
    // } else if (location.value) {
    //     loadData(location.value.lat, location.value.lon)
    // }
})


onBeforeUnmount(() => {
    if (favsInterval.value) {
        clearInterval(favsInterval.value)
    }

    if (mainInterval.value) {
        clearInterval(mainInterval.value)
    }
})

const touchStartHandle = (e: string) => {
    if (e === 'left') {
        window.scrollTo(0, 0)
        filterFavs.value = true

    } else if (e === 'right') {
        window.scrollTo(0, 0)
        filterFavs.value = false
    }
}

//firestore
onMounted(() => {

    busStoreInstance.initialize()

    watch(favs, () => {
        if (favs.value) {
            busStoreInstance.updateStore(favs.value)
        }
    })

    
})


</script>

<template>
    <div class="relative flex flex-col lg:w-[40%] md:w-[60%] justify-start items-center gap-[1rem] w-[100%] p-[1rem] pb-[4rem] overflow-hidden"
        v-touch:swipe="touchStartHandle">
        <Navigation />

        <div v-if="welcomePage && !loginPage && !loadBusInfo && !loadingPage">
            <Welcome />
        </div>
        <div v-if="loginPage">
            <Login :firebase-ui="firebaseUi" />
        </div>
        <div v-if="loadingPage && !loginPage && !loadBusInfo"
            class="flex flex-col gap-2 justify-center items-center w-[80%] lg:w-[40%] min-h-[80svh] overflow-hidden ">
            <LoadingPage :dark-theme="darkTheme" :location="location" :error="error" />

        </div>

        <Transition name="fly-in">
            <div v-if="loadBusInfo" class="flex justify-center items-start gap-[2%] w-[200%]">
                <div class="w-[100%] flex flex-col justify-start items-center gap-[1rem] transition-all ease-in-out duration-700"
                    :class="filterFavs ? 'hide-left' : 'show-left'">
                    <BusCard v-for="stop, index in stops.stops" :stop-name="stop.Description" :stop-code="stop.BusStopCode"
                        :bg-color-shift="index" :street-name="stop.RoadName" :services="stop.Services"
                        :distance-to-stop="stop.Distance" :stop-pos="{ lat: stop.Latitude, lon: stop.Longitude }"
                        :key="stop.BusStopCode + new Date().getTime()" />
                </div>
                <div class="w-[100%] transition-all ease-in-out duration-700"
                    :class="filterFavs ? 'show-right' : 'hide-right'">
                    <div v-show="favsStops?.stops.length === 0 || favsStops === null"
                        class="flex flex-col justify-center items-center w-[100%] h-[80vh] overflow-hidden justify-self-center">
                        <IconsBusStop :color="darkTheme ? '#e5989b' : '#6d6875'" :size="{ w: '48px', h: '48px' }" />
                        <p class="text-center tracking-wider text-[#e5989b]">There are no saved Bus Stops.</p>

                    </div>

                    <div class="flex flex-col justify-start items-center gap-[1rem]" v-show="favsStops?.stops.length !== 0">
                        <BusCard v-for="stop, index in favsStops?.stops " :stop-name="stop.Description"
                            :stop-code="stop.BusStopCode" :bg-color-shift="index" :street-name="stop.RoadName"
                            :services="stop.Services" :distance-to-stop="stop.Distance"
                            :stop-pos="{ lat: stop.Latitude, lon: stop.Longitude }"
                            :key="stop.BusStopCode + new Date().getTime()" />
                    </div>
                </div>
            </div>
        </Transition>

        <div v-if="loadBusInfo" class="fixed bottom-0 top-auto w-[100%] lg:w-[20%] lg:mb-2  h-[5%]">
            <Footer />
        </div>
        <div v-if="loggedIn"
            class="fixed bottom-[4rem] top-auto flex justify-center items-center w-[100%] lg:w-[20%] lg:mb-2 ">
            <Alerts />
        </div>
    </div>
    <div v-if="settings" class="absolute top-0 flex justify-center items-center z-10 h-[100vh] bg-black/50 w-[100%]">

        <Settings />

    </div>
</template>

<style>
.show-left {
    transform: translateX(52%);
}

.hide-left {
    transform: translateX(-54%);
    opacity: 0;
}

.hide-right {
    transform: translateX(100%);
    opacity: 0;
}

.show-right {
    transform: translateX(-52%);
}



.fly-in-enter-active {
    transform: translateY(0%);
    opacity: 1;
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.fly-in-leave-active {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.fly-in-enter-from {
    transform: translateY(60%);
    opacity: 0;
}

.fly-in-leave-to {
    opacity: 0;
    transform: translateY(40%)
}

.slide-fade-enter-active {
    transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>