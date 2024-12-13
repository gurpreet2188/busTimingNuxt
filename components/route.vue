<script setup lang="ts">
import type { RestructuredRoutes } from "../types/routes";
const props = defineProps<{ title: string; route: RestructuredRoutes }>();
const hideSearch: Ref<boolean> = useState("hideSearch");
const handleShowBusRoute = () => {
    hideSearch.value = false;
};

const switchRouteDirection: Ref<boolean> = ref(false);

const fromToStopName = computed(() => {
    if (
        Object.entries(props.route.fromStart).slice(-1)[0][1]["BusStopCode"] ===
        Object.entries(props.route.fromStart)[0][1]["BusStopCode"]
    ) {
        return "Loop: " + props.route.fromStart["1"].Description;
    } else {
        if (switchRouteDirection.value) {
            return "From: " + props.route.fromEnd["1"].Description;
        } else {
            return "From: " + props.route.fromStart["1"].Description;
        }
    }
});

const fromToStopList = computed(() => {
    if (switchRouteDirection.value) {
        return props.route.fromEnd;
    } else {
        return props.route.fromStart;
    }
});

const fromToStopListName = computed(() => {
    if (switchRouteDirection.value) {
        return "fromEnd";
    } else {
        return "fromStart";
    }
});

const hideSwitchBtn =
    Object.entries(props.route.fromStart).slice(-1)[0][1]["BusStopCode"] ===
    Object.entries(props.route.fromStart)[0][1]["BusStopCode"];
</script>

<template>
    <div class="flex flex-col justify-center items-start gap-4 w-full">
        <div class="flex flex-row justify-between items-center w-full">
            <h2 class="text-6xl text-bta-light dark:text-bta-dark">
                {{ props.title }}
            </h2>
            <button @click="handleShowBusRoute">
                <IconsClose
                    :colorClass="'stroke-bta-light dark:stroke-bta-dark'"
                    :active="true"
                    :size="{ w: '32px', h: '32px' }"
                />
            </button>
        </div>
        <div
            class="flex flex-col justify-center items-start gap-4 w-full"
            v-if="Object.keys(route.fromStart).length > 0"
        >
            <div class="flex flex-row justify-between items-center w-full">
                <p
                    class="py-2 text-xl line-clamp-1 text-ellipsis text-bta-light dark:text-bta-dark"
                >
                    {{ fromToStopName }}
                </p>
                <button
                    v-if="!hideSwitchBtn"
                    @click="
                        () => (switchRouteDirection = !switchRouteDirection)
                    "
                >
                    <IconsSwitch :size="{ w: '32px', h: '32px' }" />
                </button>
            </div>

            <div
                class="flex flex-col justify-center items-start text-bta-light dark:text-bta-dark w-full"
            >
                <div
                    class="flex flex-row justify-start gap-4 w-full"
                    v-for="(stop, index) in Object.keys(fromToStopList)"
                >
                    <div
                        :style="{
                            borderRadius:
                                index === 0
                                    ? '4rem 4rem 0 0'
                                    : index ===
                                        Object.keys(fromToStopList).length - 1
                                      ? '0 0 4rem 4rem'
                                      : '0',
                        }"
                        class="relative w-[5%] bg-bta-loading-bar-light/20 dark:bg-bta-loading-bar-dark/20"
                    >
                        <span
                            class="absolute rounded-full w-full h-[1.2rem] md:w-[1.5rem] md:h-[1.5rem] top-[1.1rem] bottom-auto md:left-[0.35rem] right-auto bg-bta-loading-bar-light dark:bg-bta-loading-bar-dark"
                        ></span>

                        <p
                            class="absolute w-full top-[4.9rem] md:top-[4.7rem] bottom-auto left-auto right-auto -rotate-90 leading-none"
                        >
                            {{
                                route[fromToStopListName][stop]["Distance"] +
                                "km"
                            }}
                        </p>
                    </div>
                    <div class="flex flex-col py-2 w-[95%]">
                        <h2 class="text-3xl">
                            {{ route[fromToStopListName][stop]["Description"] }}
                        </h2>
                        <p class="text-xl line-clamp-1 text-ellipsis">
                            {{ route[fromToStopListName][stop]["RoadName"] }}
                        </p>
                        <p>
                            {{ route[fromToStopListName][stop]["BusStopCode"] }}
                        </p>
                    </div>
                </div>
                <!-- <CardStopInfo
                    v-for="(stop, index) in Object.keys(fromToStopList)"
                    :stop-code="
                        props.route[fromToStopListName][stop]['BusStopCode']
                    "
                    :stop-name="
                        props.route[fromToStopListName][stop]['Description']
                    "
                    :stop-pos="{
                        lat: props.route[fromToStopListName][stop]['Latitude'],
                        lon: props.route[fromToStopListName][stop]['Longitude'],
                    }"
                    :street-name="
                        props.route[fromToStopListName][stop]['RoadName']
                    "
                /> -->
            </div>
        </div>
        <!-- <div
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
        </div> -->
    </div>
</template>
