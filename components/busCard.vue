<script setup lang="ts">
import BusInfo from './card/busInfo.vue';
import StopInfo from './card/stopInfo.vue';
import type { Service as BUS_SERVICE_TYPES } from '../types/bus'
// import { browser } from 'process';

const props = defineProps({ stopName: String, stopCode: String, streetName: String, stopPos: Object, services: Array<BUS_SERVICE_TYPES>, distanceToStop:Number, bgColorShift: Number })
// console.log(props.bgColorShift && 10 * props.bgColorShift)
const colors = [0, 20, 50, 80, 120, 140, 180, 220, 250, 280, 300, 320, 360]

const fav: Ref<boolean> = ref(false)

const favs: Ref<Array<string> | undefined> = useState('favs')

watchEffect(() => {
    if(props.stopCode){
        if (favs.value) {
            if (favs.value.length > 0) {
                if (favs.value.includes(props.stopCode)) {
                        fav.value = true
    
                    } else {
                        fav.value = false
                    }
            } else {
                fav.value = false
            }
        }
    }
})

</script>
<!-- :style="{ 'background-color': `hsl(${bgColorShift && colors[bgColorShift]},100%,98%)` } -->
<template>
    <div
        class="relative flex flex-col justify-center items-start gap-[2.5rem] p-[1rem] rounded-lg shadow-lg w-[100%] bg-[#ffb4a2]">
        <div class="absolute w-[1.2rem] h-[1.2rem] top-[1rem] bottom-auto right-[1rem] left-auto">
            <CardFavs :fav="fav" :stop-code="stopCode" />
        </div>
        <StopInfo :stop-name="stopName" :stop-code="stopCode" :street-name="streetName" :stop-pos="stopPos" :distance-to-stop="distanceToStop" />
        <div class="flex flex-col gap-[1rem] w-[100%]">
            <BusInfo v-for="service in services" :bus-code="service.ServiceNo" :next-bus="service.NextBus"
                :next-bus2="service.NextBus2" :next-bus3="service.NextBus3" />
        </div>
    </div>
</template>