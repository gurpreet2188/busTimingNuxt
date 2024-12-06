<script setup lang="ts">
import type { Root as BUS_STOP_TYPE } from "../types/stops";
import { useCheckIfFavStop } from "#build/imports";
import type { COMPONENT_STATE } from "~/types/components";
import { SubComponentStateKeys } from "~/types/components";
const props = defineProps<{ stopsWithServices: BUS_STOP_TYPE }>();
const isLocationLoading: Ref<boolean> = useState("isLocationLoading")
const locationError: Ref<string> = useState("locationError")
const located: Ref<boolean> = useState("located")
const favStopsFromLocal: Ref<string[] | null> = useState("favs");
const subComponentState: Ref<COMPONENT_STATE> = useState("sub_component_state")
const darkTheme: Ref<boolean> = useState('darkTheme')

const msg = computed((): string => {
    if (isLocationLoading.value) {
        return "Getting Location..."
    } else if (locationError.value) {
        return locationError.value
    } else {
        return "Getting Bus Services..."
    }
})

const nearestError = computed(() => {
    return located.value && props.stopsWithServices.stops.length === 0
})

</script>

<template>
    <div class="flex flex-col justify-start items-center gap-8 w-full">
        <LoadingPage v-if="subComponentState[SubComponentStateKeys.LOADING] || locationError.length > 0"
            :darkTheme="darkTheme" :onlyBar="false" :location="isLocationLoading" :error="locationError.length > 0"
            :msg="msg" />

        <BusCard v-else-if="subComponentState[SubComponentStateKeys.LOCATION] && stopsWithServices.stops.length > 0"
            v-for="(stop, index) in stopsWithServices.stops"
            :fav="useCheckIfFavStop(stop.BusStopCode!!, favStopsFromLocal!)" :stop-name="stop.Description"
            :stop-code="stop.BusStopCode" :bg-color-shift="index" :street-name="stop.RoadName" :services="stop.Services"
            :distance-to-stop="stop.Distance" :stop-pos="{ lat: stop.Latitude, lon: stop.Longitude }"
            :key="stop.BusStopCode!! + new Date().getTime()" />
        <div v-else-if="!nearestError" class="flex flex-col justify-center items-center w-full h-screen">
            <h2 class="text-3xl text-center font-light">Waiting for location...</h2>
        </div>
        <div v-else-if="nearestError" class="flex flex-col justify-center items-center w-full h-screen">
            <h2 class="text-3xl text-center font-light">No Bus Stops found within 1km range.</h2>
        </div>
    </div>
</template>
