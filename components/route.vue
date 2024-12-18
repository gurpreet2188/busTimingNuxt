<script setup lang="ts">
import type { RestructuredRoutes } from "../types/routes";
const props = defineProps<{ serviceNo: string; route: RestructuredRoutes }>();
const hideSearch: Ref<boolean> = useState("hideSearch");
const title: Ref<string> = useState("title");
const handleShowBusRoute = () => {
    hideSearch.value = false;
    title.value = "Search";
};

const switchRouteDirection: Ref<boolean> = ref(false);

const fromStartFirstKey = Object.keys(props.route.fromStart)[0];
const fromStartLastKey = Object.keys(props.route.fromStart)[
    Object.keys(props.route.fromStart).length - 1
];

const fromEndFirstKey =
    Object.entries(props.route.fromEnd).length > 0 &&
    Object.keys(props.route.fromEnd)[0];

const fromEndLastKey =
    Object.entries(props.route.fromEnd).length > 0 &&
    Object.keys(props.route.fromEnd)[
        Object.keys(props.route.fromEnd).length - 1
    ];

const fromToStopName = computed(() => {
    if (
        Object.entries(props.route.fromStart).slice(-1)[0][1]["BusStopCode"] ===
        Object.entries(props.route.fromStart)[0][1]["BusStopCode"]
    ) {
        return "Loop: " + props.route.fromStart[fromStartFirstKey].Description;
    } else {
        if (switchRouteDirection.value && fromEndFirstKey && fromEndLastKey) {
            return (
                "From: " +
                props.route.fromEnd[fromEndFirstKey].Description +
                "\nTo: " +
                props.route.fromEnd[fromEndLastKey].Description
            );
        } else {
            return (
                "From: " +
                props.route.fromStart[fromStartFirstKey].Description +
                "\nTo: " +
                props.route.fromStart[fromStartLastKey].Description
            );
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
        Object.entries(props.route.fromStart)[0][1]["BusStopCode"] ||
    Object.entries(props.route.fromEnd).length === 0;

const totalStops = computed(
    () => Object.keys(props.route[fromToStopListName.value]).length,
);
const totalDistance = computed(
    () =>
        props.route[fromToStopListName.value][
            Object.keys(props.route[fromToStopListName.value])[
                Object.keys(props.route[fromToStopListName.value]).length - 1
            ]
        ]["Distance"],
);
</script>

<template>
    <div class="flex flex-col justify-center items-start gap-4 w-full">
        <div class="flex flex-row justify-between items-center w-full">
            <h2 class="text-6xl text-bta-light dark:text-bta-dark">
                {{ serviceNo }}
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
            <div class="flex flex-col justify-center items-start gap-2 w-full">
                <div class="flex flex-row justify-between items-center w-full">
                    <p
                        class="py-2 text-xl whitespace-pre line-clamp-2 text-ellipsis text-bta-light dark:text-bta-dark"
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
                <p class="text-bta-light dark:text-bta-dark">
                    {{
                        totalStops +
                        " Stops / " +
                        totalDistance +
                        "km Total Distance"
                    }}
                </p>
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
                        class="relative w-[5%] bg-bta-secondary-light/50 dark:bg-bta-secondary-dark/50"
                    >
                        <span
                            class="absolute rounded-full w-full h-[1.2rem] md:w-[1.5rem] md:h-[1.5rem] top-[1.1rem] bottom-auto md:left-[0.35rem] right-auto bg-bta-secondary-light dark:bg-bta-secondary-dark"
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
            </div>
        </div>
    </div>
</template>
