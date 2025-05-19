<script setup lang="ts">
import Service from "./base/busCard/service.vue";
import Arrival from "./base/busCard/arrival.vue";
import type { BusService } from "~/types/stops";
import ArrivalWithInfo from "./base/busCard/arrivalWithInfo.vue";
import InActiveService from "./base/busCard/inActiveService.vue";
import Save from "./base/busCard/save.vue";
import UpcomingStnStops from "./base/busCard/upcomingStnStops.vue";

const props = defineProps<{
    busService: BusService;
}>();

const stnStops: Ref<string[]> = ref([]);
const route = await useGetBusRoute(
    props.busService.serviceNo,
    props.busService.stopCode,
    props.busService.bus!.NextBus!.Origin,
    props.busService.bus!.NextBus!.Destination,
);

let tempStops = [];
let rIndex = 0;
for (let r = 0; r <= route.length - 1; r++) {
    if (route[r].code === props.busService.stopCode) {
        rIndex = r;
    }
}
const updatedRoutes = route.slice(rIndex, route.length - 1);
let count = 0;
for (const r of updatedRoutes) {
    if (
        (r.description.toLowerCase().includes(" stn") ||
            r.description.toLowerCase().includes(" station")) &&
        count >= 1
    ) {
        tempStops.push(count.toString() + (count === 1 ? " Stop" : " Stops"));
        tempStops.push(r.description);
    }
    count++;
}

stnStops.value = tempStops;
</script>
<template>
    <InActiveService
        v-if="!busService.bus"
        :stop-name="busService.stopName"
        :stop-code="busService.stopCode"
        :service="busService.serviceNo"
    />
    <div
        v-else
        class="relative flex flex-col justify-center items-start gap-2 rounded-xl bg-bta-100 dark:bg-bta-800 overflow-hidden shadow-md w-full"
    >
        <Save
            class="absolute top-[3.2rem] right-[2%]"
            :code="busService.stopCode"
            :service="busService.serviceNo"
        />
        <Service
            class="self-center"
            :service-code="busService.bus.ServiceNo"
            :origin="busService.bus.NextBus!.Origin"
            :destination="busService.bus.NextBus!.Destination"
            :stops="stnStops"
        />
        <div v-if="stnStops.length > 0" class="w-full p-2 mt-6">
            <UpcomingStnStops :stops="stnStops" />
        </div>

        <div class="flex flex-col justify-center items-center gap-4 w-full">
            <div class="flex justify-center items-center gap-4 p-4 w-full">
                <ArrivalWithInfo
                    :stop-code="busService.stopCode"
                    :stop-name="busService.stopName"
                    :load="busService.bus.NextBus!.Load"
                    :type="busService.bus.NextBus!.Type"
                    :arrival-estimate="
                        busService.bus.NextBus!.EstimatedArrivalMinutes
                    "
                    :is-tracked="busService.bus.NextBus!.Monitored"
                />
                <Arrival
                    v-if="busService.bus.NextBus2"
                    :load="busService.bus.NextBus2.Load"
                    :arrvival-est-min="
                        busService.bus.NextBus2.EstimatedArrivalMinutes
                    "
                    :type="busService.bus.NextBus2.Type"
                    :wab="busService.bus.NextBus2.Feature === 'WAB'"
                    :is-tracked="busService.bus.NextBus2.Monitored"
                />

                <Arrival
                    v-if="busService.bus.NextBus3"
                    :load="busService.bus.NextBus3.Load"
                    :arrvival-est-min="
                        busService.bus.NextBus3.EstimatedArrivalMinutes
                    "
                    :type="busService.bus.NextBus3.Type"
                    :wab="busService.bus.NextBus3.Feature === 'WAB'"
                    :is-tracked="busService.bus.NextBus3.Monitored"
                />
            </div>
            <button
                @click="
                    async () =>
                        await navigateTo(STOP + '/' + busService.stopCode)
                "
                class="flex justify-between items-center p-4 bg-bta-300 dark:bg-bta-700 w-full"
            >
                <div class="flex flex-col justify-center items-start">
                    <p
                        class="font-extrabold line-clamp-1 text-bta-900 dark:text-bta-100 text-sm"
                    >
                        {{ busService.stopName }}
                    </p>
                    <p
                        class="self-start flex justify-center items-center gap-2 font-extrabold text-bta-900/80 dark:text-bta-100/80 text-sm"
                    >
                        <!-- <IconsWalk
                            :size="{ w: '18px', h: '18px' }"
                            class="fill-bta-700 dark:fill-bta-50"
                        /> -->
                        {{ parseInt((busService.distance * 100).toString()) }} m
                    </p>
                </div>
                <p
                    class="text-4xl text-bta-900 dark:text-bta-100 font-extrabold"
                >
                    {{ busService.stopCode }}
                </p>
            </button>
        </div>
    </div>
</template>
