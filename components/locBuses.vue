<script setup lang="ts">
import type { Root as BUS_STOP_TYPE } from "../types/stops";
import { useCheckIfFavStop } from "#build/imports";
const props = defineProps<{ stopsWithServices: BUS_STOP_TYPE }>();
const favStopsFromLocal: Ref<string[] | null> = useState("favs");
</script>

<template>
    <div class="flex flex-col justify-start items-center gap-2 w-full">
        <BusCard
            v-for="(stop, index) in props.stopsWithServices.stops"
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
    </div>
</template>
