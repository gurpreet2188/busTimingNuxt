<script setup lang="ts">
import type { RestructuredStops } from "~/types/stops";
const hideSearch: Ref<boolean> = useState("hideSearch");
defineProps<{ stopInfo: RestructuredStops }>();
const title: Ref<string> = useState("title");
const handleHideSearch = () => {
    hideSearch.value = false;
    title.value = "Search";
};
onMounted(() => (title.value = "Stop Info"));
const checkNoOpBuses = (timing: string) => {
    if (timing === "-") {
        return "No Op";
    } else {
        return timing;
    }
};
</script>

<template>
    <div class="flex flex-col justify-center items-start gap-8 w-full">
        <div
            class="flex flex-row justify-between items-center p-2 w-full rounded-md bg-bta-elevated-light dark:bg-bta-elevated-dark"
        >
            <h2
                class="text-bta-inverted dark:text-bta-dark line-clamp-1 text-ellipsis"
            >
                {{ stopInfo.Description }}
            </h2>
            <button @click="handleHideSearch">
                <IconsClose
                    :colorClass="'stroke-bta-inverted dark:stroke-bta-dark'"
                    :active="true"
                    :size="{ w: '22px', h: '22px' }"
                />
            </button>
        </div>
        <CardStopInfo
            :stop-code="stopInfo.BusStopCode"
            :stop-pos="{ lat: stopInfo.Latitude, lon: stopInfo.Longitude }"
            :street-name="stopInfo.RoadName"
            :stop-name="''"
        />
        <div
            class="flex flex-col justify-center items-start gap-4 text-bta-inverted dark:text-bta-dark p-2 w-full rounded-md bg-bta-elevated-light dark:bg-bta-elevated-dark"
            v-for="service of Object.entries(stopInfo.Service)"
        >
            <div class="flex flex-col w-full gap-4">
                <div class="grid grid-cols-3 w-full gap-2">
                    <div
                        class="flex flex-col justify-end items-start gap-2 w-full"
                    >
                        <button
                            class="btn-common line-clamp-1 whitespace-nowrap"
                        >
                            {{ service[1].ServiceNo }}
                        </button>
                        <p>Weekday</p>
                        <p>Saturday</p>
                        <p>Sunday/PH</p>
                    </div>
                    <div
                        class="flex flex-col justify-center items-center gap-2"
                    >
                        <p class="text-xl p-2">First Bus</p>
                        <p>{{ service[1].WD_FirstBus }}</p>
                        <p>{{ checkNoOpBuses(service[1].SAT_LastBus) }}</p>
                        <p>{{ checkNoOpBuses(service[1].SUN_FirstBus) }}</p>
                    </div>
                    <div
                        class="flex flex-col justify-center items-center gap-2"
                    >
                        <p class="text-xl p-2">Last Bus</p>
                        <p>{{ service[1].WD_LastBus }}</p>
                        <p>{{ checkNoOpBuses(service[1].SAT_FirstBus) }}</p>
                        <p>{{ checkNoOpBuses(service[1].SUN_LastBus) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
