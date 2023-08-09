<script setup lang="ts">
import type { Service as BUS_INFO_SERVICE_TYPES, NextBus as NEXT_BUS_TYPE } from '../../types/bus'
import type { PropType } from 'vue';


const props = defineProps({ busCode: String, busTimings: Array<BUS_INFO_SERVICE_TYPES>, nextBus: Object as PropType<NEXT_BUS_TYPE>, nextBus2: Object as PropType<NEXT_BUS_TYPE>, nextBus3: Object as PropType<NEXT_BUS_TYPE> })

const busUTCToMins = (UTCTime: string): string => {
    const busUTC = Date.parse(UTCTime)
    const s = new Date(busUTC)
    const d = new Date()
    const delta = (s.getTime() - d.getTime()) / 60000
    if (Number.isNaN(delta)) { return "" }
    return delta <= 1 ? 'Arr' : Math.round(delta) + ' mins'
}
</script>

<template>
    <div class="flex flex-col gap-[0.05rem] w-[100%]">

        <div class="grid grid-cols-4 w-[100%]">
            <p>{{ busCode }}</p>
            <p v-show="nextBus">{{ nextBus && busUTCToMins(nextBus.EstimatedArrival) }}</p>
            <p v-show="nextBus2">{{ nextBus2 && busUTCToMins(nextBus2.EstimatedArrival) }}</p>
            <p v-show="nextBus3">{{ nextBus3 && busUTCToMins(nextBus3.EstimatedArrival) }}</p>
        </div>
        <div class="flex justify-between overflow-hidden">
            <p class="text-[0.75rem] text-gray-700/50">{{ nextBus && nextBus.Origin }} -> {{ nextBus && nextBus.Destination
            }}</p>
            <!-- <p class="text-[0.8rem] text-gray-700/50">To: {{ nextBus && nextBus.Destination }}</p> -->
        </div>
    </div>
</template>