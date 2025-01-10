<script setup lang="ts">
import BusInfo from "./card/busInfo.vue";
import StopInfo from "./card/stopInfo.vue";
import type { Service as BUS_SERVICE_TYPES } from "../types/bus";
// import { browser } from 'process';

const props = defineProps({
    fav: Boolean,
    stopName: String,
    stopCode: String,
    streetName: String,
    stopPos: Object,
    services: Array<BUS_SERVICE_TYPES>,
    distanceToStop: Number,
    bgColorShift: Number,
});
</script>

<template>
    <div
        class="relative flex flex-col justify-center items-start gap-2 p-2 w-[100%] bg-bta-elevated-light/5"
    >
        <StopInfo
            :fav="fav"
            :stop-name="stopName"
            :stop-code="stopCode"
            :street-name="streetName"
            :stop-pos="stopPos"
            :distance-to-stop="distanceToStop"
        />
        <div class="flex flex-col gap-[1rem] w-[100%]">
            <BusInfo
                v-for="service in services"
                :bus-code="service.ServiceNo"
                :next-bus="service.NextBus"
                :next-bus2="service.NextBus2"
                :next-bus3="service.NextBus3"
            />
        </div>
    </div>
</template>
