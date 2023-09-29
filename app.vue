<script setup lang="ts">
import { _AsyncData } from 'nuxt/dist/app/composables/asyncData';
import type { Root as BUS_STOP_TYPES, Stop as BUS_STOP_TYPE } from 'types/stops';

import { fetchData } from './helper/fetchData'
import { useGeolocation } from '@vueuse/core'

useHead({ bodyAttrs: { class: 'bg-[#ffcdb2] dark:bg-[#0d1b2a] min-h-full' }, htmlAttrs: { class: 'min-h-full' } })



const getData = async (pos: { lat: number, lon: number }) => {

    const res = await fetch(`${import.meta.env['VITE_APP_BASE_URL']}/api/find-nearest-stops`, { method: 'POST', body: JSON.stringify(pos) })
    const data = await res.json()
    return await data
}

const transitionLoad: Ref<boolean> = ref(false)
const pos = useGeolocation()
const favsStops: Ref<BUS_STOP_TYPES | null> = useState('favsStops', () => null)
const filterFavs: Ref<Boolean> = useState('filterFavs', () => false)
const favs: Ref<Array<string> | undefined> = useState('favs', () => undefined)
const stops: Ref<BUS_STOP_TYPES> = ref({ stops: [] })
const darkTheme: Ref<boolean> = useState('darkTheme', () => false)
const localStorageLocation: Ref<{ lat: number, lon: number } | null> = ref(null)
const location: Ref<{ lat: number, lon: number } | null> = ref(null)
const windowBlur: Ref<boolean> = ref(false)

onMounted(async () => {
    favs.value = localStorage.getItem('favs') && JSON.parse(localStorage.getItem('favs') as string)
    if (localStorage.getItem('location')) {
        localStorageLocation.value = JSON.parse(localStorage.getItem('location') as string)
    }

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
    console.log(windowBlur.value)
    const timeout = setTimeout(() => {
        if (favsInterval.value && windowBlur.value) {
            console.log('clearing interval')
            clearInterval(favsInterval.value)
        }

        if (mainInterval.value && windowBlur.value) {
            clearInterval(mainInterval.value)
        }
    }, 60000)

    if (!windowBlur.value) {
        if (timeout) {
            console.log('clearing blur timeout')
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
                    console.log('fetching data in interval, favs')
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
        console.log('clearing interval')
        clearInterval(favsInterval.value)
    }
})


watchEffect(async () => {
    if (pos.coords.value.latitude !== Infinity && pos.coords.value.longitude !== Infinity) {
        pos.pause()
        console.log('found location')
        window.localStorage.setItem('location', JSON.stringify({ lat: pos.coords.value.latitude, lon: pos.coords.value.longitude }))
        location.value = { lat: pos.coords.value.latitude, lon: pos.coords.value.longitude }
    }

})

watchEffect(() => {
    const loadData = async (lat: number, lon: number) => {
        stops.value = await getData({ lat: lat, lon: lon })
        if (stops.value.stops.length > 0) {
            stops.value = await fetchData(stops.value.stops)
            console.log('fetching data')
            mainInterval.value = setInterval(async () => {
                console.log('fetching data in interval, main')
                stops.value = await fetchData(stops.value.stops)
            }, 60000)

            transitionLoad.value = true
        }
    }
    if (localStorageLocation.value) {
        loadData(localStorageLocation.value.lat, localStorageLocation.value.lon)
    } else if (location.value && localStorageLocation.value) {
        if (location.value !== localStorageLocation.value) {
            loadData(location.value.lat, location.value.lon)
        }
    } else if (location.value) {
        loadData(location.value.lat, location.value.lon)
    }
})


onBeforeUnmount(() => {
    if (favsInterval.value) {
        console.log('clearing interval')
        clearInterval(favsInterval.value)
    }

    if (mainInterval.value) {
        clearInterval(mainInterval.value)
    }
})

const touchStartHandle =(e:string)=>{
    if(e === 'left') {
        filterFavs.value = true
    } else if (e === 'right'){
        filterFavs.value = false
    }
}

</script>

<template>
    <div
        class="flex flex-col lg:w-[40%] md:w-[60%] justify-start items-center gap-[1rem] w-[100%] p-[1rem] pb-[4rem] overflow-hidden min-h-[100svh]" v-touch:swipe="touchStartHandle">
        <Navigation />
        <Transition name="fly-in">
            <div v-if="transitionLoad" class="flex justify-center items-start gap-[2%] w-[200%]" >
                <div class="w-[100%] flex flex-col justify-start items-center gap-[1rem]  transition-all ease-in-out duration-700" :class="filterFavs ? 'hide-left' : 'show-left'">
                    <BusCard v-for="stop, index in stops.stops"
                        :stop-name="stop.Description" :stop-code="stop.BusStopCode" :bg-color-shift="index"
                        :street-name="stop.RoadName" :services="stop.Services" :distance-to-stop="stop.Distance"
                        :stop-pos="{ lat: stop.Latitude, lon: stop.Longitude }"
                        :key="stop.BusStopCode + new Date().getTime()" />
                </div>
                <div class="w-[100%] transition-all ease-in-out duration-700" :class="filterFavs ? 'show-right' : 'hide-right'">
                    <div v-show="favsStops?.stops.length === 0"
                        class="flex flex-col justify-center items-center w-[100%] h-[80vh] overflow-hidden justify-self-center">
                        <IconsBusStop :color="darkTheme ? '#e5989b' : '#6d6875'" :size="{ w: '48px', h: '48px' }" />
                        <p class="text-center tracking-wider text-[#e5989b]">There are no saved Bus Stops.</p>

                    </div>

                    <div class="flex flex-col justify-start items-center gap-[1rem]" v-show="favsStops?.stops.length !== 0">
                        <BusCard v-for="stop, index in favsStops?.stops "
                    :stop-name="stop.Description" :stop-code="stop.BusStopCode" :bg-color-shift="index"
                    :street-name="stop.RoadName" :services="stop.Services" :distance-to-stop="stop.Distance"
                    :stop-pos="{ lat: stop.Latitude, lon: stop.Longitude }"
                    :key="stop.BusStopCode + new Date().getTime()" />
                    </div>
                </div>
            </div>
        </Transition>

        <div v-if="transitionLoad" class="fixed bottom-0 top-auto w-[100%] lg:w-[20%] lg:mb-2  h-[5%]">
            <Footer />
        </div>
    </div>
    <div v-if="!transitionLoad"
        class="flex flex-col gap-2 justify-center items-center w-[80%] h-[80vh] lg:w-[40%] overflow-hidden ">
        <div class="relative h-[48px] w-[48px]">
            <div class="absolute">
                <IconsBusStop v-if="location || localStorageLocation" :color="darkTheme ? '#e5989b' : '#6d6875'"
                    :size="{ w: '48px', h: '48px' }" />
                <IconsLocation v-if="!(location || localStorageLocation)" :color="darkTheme ? '#e5989b' : '#6d6875'"
                    :size="{ w: '48px', h: '48px' }" />
            </div>
        </div>
        <div class="relative flex flex-col  w-[90%] h-[2px] bg-[#e5989b]/50 ">

            <span class="absolute w-[90%] h-[2px] bg-[#e5989b] loading-bar "></span>
        </div>
        <p class="text-center tracking-wider text-[#e5989b] ">
            {{ location || localStorageLocation ? 'Finding nearest busStops' : 'Waiting for device Location' }}</p>

    </div>
</template>

<style>

.show-left {
    transform: translateX(52%);
}

.hide-left {
    transform: translateX(-54%);
}

.hide-right {
    transform: translateX(100%);
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

.loading-bar {
    animation: loadingAnimation 2s linear infinite;
}

@keyframes loadingAnimation {

    0%,
    100% {
        transform: translateX(-100%);
    }

    50% {
        transform: translateX(100%);
    }
}
</style>