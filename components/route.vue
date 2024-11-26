<script setup lang="ts">
import type { ResturcturedRoutes } from "../types/routes";
const props = defineProps<{ title: string; route: ResturcturedRoutes }>();
const showBusRoute: Ref<boolean> = useState("showBusRoute");
const darkTheme = useState("darkTheme");
const handleShowBusRoute = () => {
    showBusRoute.value = false;
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
                <p
                    class="line-clamp-1 text-ellipsis text-black dark:text-white"
                    v-for="(stop, index) in Object.keys(props.route.fromStart)"
                >
                    {{ props.route.fromStart[stop]["StopSequence"] }}
                    {{ props.route.fromStart[stop]["Description"] }}
                </p>
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
                <p
                    class="line-clamp-1 text-ellipsis text-black dark:text-white"
                    v-for="(stop, index) in Object.keys(props.route.fromEnd)"
                >
                    {{ props.route.fromEnd[stop]["StopSequence"] }}
                    {{ props.route.fromEnd[stop]["Description"] }}
                </p>
            </div>
        </div>
    </div>
</template>
