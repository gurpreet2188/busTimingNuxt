<script setup lang="ts">
import BusInfo from "./card/busInfo.vue";
import StopInfo from "./card/stopInfo.vue";
const darkTheme = useState("darkTheme");
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
const keepCard: Ref<boolean> = ref(true);
const favClickhandle = () => {
    if (props.stopCode) {
        useFavStop(props.stopCode, !props.fav);
    }
};
</script>
<!-- :style="{ 'background-color': `hsl(${bgColorShift && colors[bgColorShift]},100%,98%)` } -->
<template>
    <div
        class="relative flex flex-col justify-center items-start gap-8 p-4 rounded-lg dark:shadow-none w-[100%] bg-[#ffe5d9] dark:bg-[#1b263b]"
    >
        <div
            class="absolute w-[2rem] h-[2rem] top-[1.12rem] bottom-auto right-[1rem] left-auto"
        >
            <!-- <CardFavs :fav="fav" :stop-code="stopCode" /> -->
            <button
                @click="favClickhandle"
                class="flex justify-center items-center rounded-full w-[100%] h-[100%] p-1"
            >
                <div>
                    <IconsFavs
                        :color="darkTheme ? '#ffcdb2' : '#7f5539'"
                        :active="fav"
                        :size="{ w: '22px', h: '22px' }"
                    />
                </div>
            </button>
        </div>
        <StopInfo
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
