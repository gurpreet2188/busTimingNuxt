<script setup lang="ts">
import { _AsyncData } from 'nuxt/dist/app/composables/asyncData';
import type { Root as BUS_STOP_TYPES, Stop as BUS_STOP_TYPE } from 'types/stops';
import { fetchData } from './helper/fetchData'
import { useGeolocation } from '@vueuse/core'

useHead({ bodyAttrs: { class: 'bg-gradient-to-br from-blue-200 to-orange-100 min-h-full' }, htmlAttrs: { class: 'min-h-full' } })

const getData = async (pos: { lat: number, lon: number }) => {

    const res = await fetch(`${import.meta.env['VITE_APP_BASE_URL']}/api/find-nearest-stops`, { method: 'POST', body: JSON.stringify(pos) })
    const data = await res.json()
    return await data
}

const transitionLoad:Ref<boolean> = ref(false)
const pos = useGeolocation()
const favsStops: Ref<BUS_STOP_TYPES | null> = useState('favsStops', () => null)
const filterFavs: Ref<Boolean> = useState('filterFavs', () => false)
const favs: Ref<Array<string> | undefined> = useState('favs', () => undefined)
const stops: Ref<BUS_STOP_TYPES> = ref({ stops: [] })


onMounted(async () => {
    favs.value = localStorage.getItem('favs') && JSON.parse(localStorage.getItem('favs') as string)
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
                setInterval(() => {
                    console.log('fetching data in interval')
                    fetchData(tempfavStops.stops).then(d => favsStops.value = d)
                }, 60000)
            }
        } else {
            favsStops.value = { stops: [] }
        }
    }
})

watchEffect(async () => {
    if (pos.coords.value.latitude !== Infinity && pos.coords.value.longitude !== Infinity) {
        pos.pause()

        //1.281189, 103.838693
        stops.value = await getData({ lat: pos.coords.value.latitude, lon: pos.coords.value.longitude })
        if (stops.value.stops.length > 0) {
            stops.value = await fetchData(stops.value.stops)
            setInterval(async () => {
                stops.value = await fetchData(stops.value.stops)
            }, 60000)
        }
        transitionLoad.value = true
    }
})



</script>

<template>
    <div
        class="flex flex-col lg:w-[40%] md:w-[60%] justify-start items-center gap-[1rem] w-[100%] p-[1rem] pb-[4rem] overflow-hidden">
        <Navigation />
        <Transition name="fly-in">
            <div v-if="transitionLoad" class="flex flex-col justify-center items-center gap-[1rem] w-[100%]">
                <BusCard v-for="stop, index in filterFavs === true ? favsStops?.stops : stops.stops"
                    :stop-name="stop.Description" :stop-code="stop.BusStopCode" :bg-color-shift="index"
                    :street-name="stop.RoadName" :services="stop.Services" :distance-to-stop="stop.Distance"
                    :stop-pos="{ lat: stop.Latitude, lon: stop.Longitude }" />
            </div>
        </Transition>
        <div v-show="filterFavs && (favsStops?.stops.length === 0)" class="w-[100%] justify-self-center">
            <p>No Favs :( </p>
        </div>
        <div class="fixed bottom-0 top-auto w-[100%] lg:w-[20%] lg:mb-2  h-[5%]">
            <Footer />
        </div>
    </div>
</template>

<style>

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
</style>