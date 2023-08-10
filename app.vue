<script setup lang="ts">
// import('~/assets/css/tailwind.css')
import { _AsyncData } from 'nuxt/dist/app/composables/asyncData';
// import { getCurrentLocation } from './helper/location'
import type { Root as BUS_STOP_TYPES, Stop as BUS_STOP_TYPE } from 'types/stops';
import { fetchData } from './helper/fetchData' 
import { useGeolocation } from '@vueuse/core'

useHead({ bodyAttrs: { class: 'bg-gradient-to-br from-blue-200 to-orange-100 min-h-full' }, htmlAttrs: { class: 'min-h-full' } })

const getData = async (pos: { lat: number, lon: number }) => {
    console.log(pos)
    const res = await fetch(`${import.meta.env['VITE_APP_BASE_URL']}/api/find-nearest-stops`, { method: 'POST', body: JSON.stringify(pos) })
    const data = await res.json()
    return await data
}

const favsStops: Ref<BUS_STOP_TYPES | null> = useState('favsStops', () => null)
const filterFavs: Ref<Boolean> = useState('filterFavs', () => false)
const favs: Ref<Array<string> | undefined> = useState('favs', () => undefined)
const stops: Ref<BUS_STOP_TYPES> = ref({ stops: [] })
const pos = useGeolocation()


onMounted(async () => {
    favs.value = localStorage.getItem('favs') && JSON.parse(localStorage.getItem('favs') as string)
})

watch(pos.coords, async ()=>{
    if (pos.coords.value.latitude !== 0 && pos.coords.value.longitude !== 0) {
        pos.pause()
        console.log(pos)
        //1.281189, 103.838693
        stops.value = await getData({lat:pos.coords.value.latitude, lon:pos.coords.value.longitude})
        if (stops.value.stops.length > 0) {
            stops.value = await fetchData(stops.value.stops)
        }
}
})

watchEffect(async () => {
   console.log(stops)
    const favs: Ref<Array<string> | undefined> = useState('favs')
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
            }
        } else {
            favsStops.value = { stops: [] }
        }
    }
})

</script>

<template>
    <div
        class="flex flex-col justify-start items-center gap-[1rem] first-letter:w-[100%] p-[1rem] pb-[4rem] overflow-hidden">
        <Navigation />
        <div class="flex flex-col justify-center items-center gap-[1rem] w-[100%]">
            <BusCard v-for="stop, index in filterFavs === true ? favsStops?.stops : stops.stops"
                :stop-name="stop.Description" :stop-code="stop.BusStopCode" :bg-color-shift="index"
                :street-name="stop.RoadName" :services="stop.Services" :distance-to-stop="stop.Distance"
                :stop-pos="{ lat: stop.Latitude, lon: stop.Longitude }" />
        </div>
        <div v-show="filterFavs && (favsStops?.stops.length === 0)" class="w-[100%] justify-self-center">
            <p>No Favs :( </p>
        </div>
        <div class="fixed bottom-0 top-auto w-[100%] h-[5%]">
            <Footer />
        </div>
    </div>
</template>