<script setup lang="ts">
import type { Root as BUS_STOP_TYPE } from "../types/stops";
import { useCheckIfFavStop } from "#build/imports";
defineProps<{ stopsWithServices: BUS_STOP_TYPE }>();
const isLocationLoading: Ref<boolean> = useState("isLocationLoading");
const locationError: Ref<string> = useState("locationError");
const located: Ref<boolean> = useState("located");
const favStopsFromLocal: Ref<string[] | null> = useState("favs");
const isStopsError: Ref<boolean> = useState("isStopsError", () => false);
const darkTheme: Ref<boolean> = useState("darkTheme");

const msg = computed((): string => {
    if (isLocationLoading.value) {
        return "Finding nearest Bus Stops...";
    } else if (locationError.value) {
        return locationError.value;
    } else if (located.value) {
        isStopsError.value = true;
        return "No stops found within 1km range.";
    }
    return "";
});
</script>

<template>
    <div class="flex flex-col justify-start items-center gap-8 w-full">
        <BusCard
            v-if="stopsWithServices.stops.length > 0"
            v-for="(stop, index) in stopsWithServices.stops"
            :fav="useCheckIfFavStop(stop.BusStopCode!!, favStopsFromLocal!)"
            :stop-name="stop.Description"
            :stop-code="stop.BusStopCode"
            :bg-color-shift="index"
            :street-name="stop.RoadName"
            :services="stop.Services"
            :distance-to-stop="stop.Distance"
            :stop-pos="{ lat: stop.Latitude, lon: stop.Longitude }"
            :key="stop.BusStopCode!! + new Date().getTime()"
        />

        <LoadingPage
            v-else
            :darkTheme="darkTheme"
            :onlyBar="false"
            :location="isLocationLoading"
            :error="locationError.length > 0 || isStopsError"
            :msg="msg"
        />
    </div>
</template>
