<script setup lang="ts">
import type { Stop } from "../types/stops";
import { useCheckIfFavStop } from "#build/imports";
const props = defineProps<{ stopsWithServices: Stop[] | null }>();
const isLocationLoading: Ref<boolean> = useState("isLocationLoading");
const locationError: Ref<string> = useState("locationError");
const located: Ref<boolean> = useState("located");
const favStopsFromLocal: Ref<string[] | null> = useState("favs");
const isStopsError: Ref<boolean> = useState("isStopsError", () => false);
const darkTheme: Ref<boolean> = useState("darkTheme");
const title: Ref<string> = useState("title");

onMounted(() => (title.value = "Near By stops"));

const msg = computed((): string => {
    let m = "";
    if (isLocationLoading.value) {
        m = "Finding nearest Bus Stops...";
    } else if (locationError.value) {
        m = locationError.value;
    } else if (
        located.value &&
        props.stopsWithServices &&
        props.stopsWithServices!!.length === 0
    ) {
        isStopsError.value = true;
        m = "No stops found within 1km range.";
    }
    return m;
});
</script>

<template>
    <div class="flex flex-col justify-start items-center gap-8 pb-20 w-full">
        <BusCard
            v-if="stopsWithServices && stopsWithServices!!.length!! > 0"
            v-for="(stop, index) in stopsWithServices!!"
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
            v-else-if="locationError.length > 0 || isStopsError"
            :showBarOnly="false"
            :darkTheme="darkTheme"
            :location="isLocationLoading"
            :error="locationError.length > 0 || isStopsError"
            :msg="msg"
        />

        <LoadingPage
            v-else
            :showBarOnly="true"
            :location="false"
            :error="false"
            :msg="msg"
        />
    </div>
</template>
