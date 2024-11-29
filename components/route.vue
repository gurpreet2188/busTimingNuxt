<script setup lang="ts">
import type { RestructuredRoutes } from "../types/routes";
const props = defineProps<{ title: string; route: RestructuredRoutes }>();
const hideSearch: Ref<boolean> = useState("hideSearch");
const darkTheme = useState("darkTheme");
const handleShowBusRoute = () => {
    hideSearch.value = false;
};
</script>

<template>
    <div class="flex flex-col justify-center items-start gap-4 w-full">
        <div
            class="flex flex-row justify-between items-center p-2 w-full rounded-md bg-[#ffe5d9] dark:bg-[#1b263b]"
        >
            <h2 class="text-xl text-[#7f5539] dark:text-[#ffcdb2]">
                Route for Service: {{ props.title }}
            </h2>
            <button @click="handleShowBusRoute">
                <IconsClose
                    :color="darkTheme ? '#ffcdb2' : '#7f5539'"
                    :active="true"
                    :size="{ w: '22px', h: '22px' }"
                />
            </button>
        </div>
        <div
            class="flex flex-col justify-center items-start gap-4 w-full"
            v-if="Object.keys(route.fromStart).length > 0"
        >
            <p
                class="py-2 border-b-2 border-black/10 w-screen text-black dark:text-white"
            >
                {{
                    (Object.entries(props.route.fromStart).slice(-1)[0][1][
                        "BusStopCode"
                    ] ===
                    Object.entries(props.route.fromStart)[0][1]["BusStopCode"]
                        ? "Loop: "
                        : "From: ") + route.fromStart["1"].Description
                }}
            </p>

            <div class="flex flex-col justify-center items-start gap-2 w-full">
                <CardStopInfo
                    v-for="(stop, index) in Object.keys(props.route.fromStart)"
                    :stop-code="props.route.fromStart[stop]['BusStopCode']"
                    :stop-name="props.route.fromStart[stop]['Description']"
                    :stop-pos="{
                        lat: props.route.fromStart[stop]['Latitude'],
                        lon: props.route.fromStart[stop]['Longitude'],
                    }"
                    :street-name="props.route.fromStart[stop]['RoadName']"
                />
                <!-- <p
                    class="line-clamp-1 text-ellipsis text-black dark:text-white"
                    v-for="(stop, index) in Object.keys(props.route.fromStart)"
                >
                    {{ props.route.fromStart[stop]["StopSequence"] }}
                    {{ props.route.fromStart[stop]["RoadName"] }} /
                    {{ props.route.fromStart[stop]["Description"] }}
                </p> -->
            </div>
        </div>
        <div
            class="flex flex-col justify-center items-start gap-4 w-full"
            v-if="Object.keys(route.fromEnd).length > 0"
        >
            <p
                class="py-2 border-b-2 border-black/10 w-full text-black dark:text-white"
            >
                From: {{ route.fromEnd["1"].Description }}
            </p>

            <div class="flex flex-col justify-center items-start gap-2 w-full">
                <CardStopInfo
                    v-for="(stop, index) in Object.keys(props.route.fromEnd)"
                    :stop-code="props.route.fromEnd[stop]['BusStopCode']"
                    :stop-name="props.route.fromEnd[stop]['Description']"
                    :stop-pos="{
                        lat: props.route.fromEnd[stop]['Latitude'],
                        lon: props.route.fromEnd[stop]['Longitude'],
                    }"
                    :street-name="props.route.fromEnd[stop]['RoadName']"
                />
            </div>
        </div>
    </div>
</template>
