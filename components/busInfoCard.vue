<script setup lang="ts">
import Service from "./base/busCard/service.vue";
import Arrival from "./base/busCard/arrival.vue";
import type { BusService } from "~/types/stops";
import ArrivalWithInfo from "./base/busCard/arrivalWithInfo.vue";
import InActiveService from "./base/busCard/inActiveService.vue";
import Save from "./base/busCard/save.vue";

const props = defineProps<{
    busService: BusService;
}>();
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
            class="absolute top-[23%] right-[2%]"
            :code="busService.stopCode"
            :service="busService.serviceNo"
        />
        <Service
            class="self-center"
            :service-code="busService.bus.ServiceNo"
            :origin="busService.bus.NextBus!.Origin"
            :destination="busService.bus.NextBus!.Destination"
        />

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
                />
                <Arrival
                    v-if="busService.bus.NextBus2"
                    :load="busService.bus.NextBus2.Load"
                    :arrvival-est-min="
                        busService.bus.NextBus2.EstimatedArrivalMinutes
                    "
                    :type="busService.bus.NextBus2.Type"
                    :wab="busService.bus.NextBus2.Feature === 'WAB'"
                />

                <Arrival
                    v-if="busService.bus.NextBus3"
                    :load="busService.bus.NextBus3.Load"
                    :arrvival-est-min="
                        busService.bus.NextBus3.EstimatedArrivalMinutes
                    "
                    :type="busService.bus.NextBus3.Type"
                    :wab="busService.bus.NextBus3.Feature === 'WAB'"
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
