<script setup lang="ts">
import type { Service as BUS_INFO_SERVICE_TYPES, NextBus as NEXT_BUS_TYPE } from '../../types/bus'
import type { PropType } from 'vue';
import {fetchPOST} from '../../helper/fetchData'

const props = defineProps({ busCode: String, busTimings: Array<BUS_INFO_SERVICE_TYPES>, nextBus: Object as PropType<NEXT_BUS_TYPE>, nextBus2: Object as PropType<NEXT_BUS_TYPE>, nextBus3: Object as PropType<NEXT_BUS_TYPE> })

const busUTCToMins = (UTCTime: string): string => {
    const busUTC = Date.parse(UTCTime)
    const s = new Date(busUTC)
    const d = new Date()
    const delta = (s.getTime() - d.getTime()) / 60000
    if (Number.isNaN(delta)) { return "" }
    return delta <= 1 ? 'Arr' : Math.round(delta) + ' mins'
}

const showOriginDestination: Ref<boolean> = ref(false)

watch(showOriginDestination, async () => {

    if (showOriginDestination.value && props.nextBus && (!props.nextBus.Destination  || !props.nextBus.Origin)) {
        const tempOrigin: { name: string } = await fetchPOST('/api/stop-name', { 'stopCode': props.nextBus.OriginCode })
        const tempDestination: { name: string } = await fetchPOST('/api/stop-name', { 'stopCode': props.nextBus.DestinationCode })
        if (tempOrigin['name'] && tempDestination['name']) {
            props.nextBus.Origin = tempOrigin['name']
            props.nextBus.Destination = tempDestination['name']
        }
    }
})

const clickHandle = () => {
    showOriginDestination.value = !showOriginDestination.value
}

</script>

<template>
    <div class="flex flex-col justify-start items-start gap-[0.05rem] w-[100%]">

        <div class="grid grid-cols-bus-info w-[100%]">
            <button @click="clickHandle" class="text-left">{{ busCode }}</button>
            <div v-show="!showOriginDestination" class="grid grid-cols-3">
                <p v-show="nextBus">{{ nextBus && busUTCToMins(nextBus.EstimatedArrival) }}</p>
                <p v-show="nextBus2">{{ nextBus2 && busUTCToMins(nextBus2.EstimatedArrival) }}</p>
                <p v-show="nextBus3">{{ nextBus3 && busUTCToMins(nextBus3.EstimatedArrival) }}</p>
            </div>
            <div v-show="showOriginDestination" class="flex justify-between overflow-hidden">
                <p class="text-[0.75rem] text-gray-700/50">{{ nextBus && nextBus.Origin }} -> {{ nextBus &&
                    nextBus.Destination
                }}</p>
            </div>
        </div>

    </div>
</template>