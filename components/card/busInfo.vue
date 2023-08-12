<script setup lang="ts">
import type { Service as BUS_INFO_SERVICE_TYPES, NextBus as NEXT_BUS_TYPE } from '../../types/bus'
import type { PropType } from 'vue';
import { fetchPOST } from '../../helper/fetchData'

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
const darkTheme:Ref<boolean> = useState('darkTheme')

watch(showOriginDestination, async () => {

    if (showOriginDestination.value && props.nextBus && (!props.nextBus.Destination || !props.nextBus.Origin)) {
        const tempOrigin: { name: string } = await fetchPOST('/api/stop-name', { 'stopCode': props.nextBus.OriginCode })
        const tempDestination: { name: string } = await fetchPOST('/api/stop-name', { 'stopCode': props.nextBus.DestinationCode })
        console.log(tempOrigin,tempDestination)
        if (tempOrigin['name'] && tempDestination['name']) {
            props.nextBus.Origin = tempOrigin['name']
            props.nextBus.Destination = tempDestination['name']
        }
    }
})

const clickHandle = () => {
    showOriginDestination.value = !showOriginDestination.value
   
}

const busLoadTextColor = (load: string | undefined) => {
    if (load ) {
        // g - 99d98c , o- ffb600, 
        if(darkTheme.value){
            return load === 'SEA' ? '#99d98c' : load === 'SDA' ? '#ffb600' : '#ff4d6d'
        } else {
            return load === 'SEA' ? '#84a98c' : load === 'SDA' ? '#ff7d00' : '#ae2012'
        }
    } 
}

</script>

<template>
    <div class="flex flex-col justify-start items-start gap-[0.05rem] w-[100%] text-[#6d6875] dark:text-[#ffcdb2]">
        <!-- <div class="grid grid-cols-bus-info w-[100%]"> -->
        <button @click="clickHandle" class="grid grid-cols-4 w-[100%]">
            <p class="text-left">{{ busCode }}</p>
            <!-- <div class="grid grid-cols-3"> -->
            <p v-show="nextBus">{{ nextBus &&
                busUTCToMins(nextBus.EstimatedArrival) }}</p>
            <p v-show="nextBus2">{{ nextBus2 &&
                busUTCToMins(nextBus2.EstimatedArrival) }}</p>
            <p v-show="nextBus3">{{ nextBus3 &&
                busUTCToMins(nextBus3.EstimatedArrival) }}</p>
            <!-- </div> -->
        </button>
        <Transition>
            <div v-if="showOriginDestination" class="flex flex-col justify-between overflow-hidden w-[100%]">
                <div class="grid grid-cols-4 justify-items-center">
                    <p class="text-left opacity-0">{{ busCode }}</p>
                    <CardBusTypeIcons :bus-type="nextBus?.Type" :color="busLoadTextColor(nextBus?.Load)" />
                    <CardBusTypeIcons :bus-type="nextBus2?.Type" :color="busLoadTextColor(nextBus2?.Load)" />
                    <CardBusTypeIcons :bus-type="nextBus3?.Type" :color="busLoadTextColor(nextBus3?.Load)" />
                </div>
                <p v-if="nextBus?.Origin && nextBus?.Destination" class="text-[0.7rem]">{{ nextBus && nextBus.Origin }} -> {{ nextBus &&
                    nextBus.Destination
                }}</p>

            </div>
        </Transition>
        <!-- </div> -->

    </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>