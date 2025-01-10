<script setup lang="ts">
import type { ServiceTiming, Stop } from "~/types/stops";
import { GoogleMap, Marker } from "vue3-google-map";

const expandedNavComponent: Ref<string | null> = useState("expandedNavComponent")
const expandedNavProps: Ref<{}> = useState("expandedNavProps")
const hideSearch: Ref<boolean> = useState("hideSearch");
const props = defineProps<{ stopInfo: Stop }>();
const title: Ref<string> = useState("title");

const servicesTiming: Ref<ServiceTiming[] | null> = useState(
    "serviceTiming",
    () => null,
);
const key = process.env.GMAP_KEY!
const lastScroll: Ref<number> = useState("searchLastScroll");

onBeforeMount(async () => {
    servicesTiming.value = await $fetch("/api/get-services", {
        body: { single: props.stopInfo.code },
        method: "POST",
    });
    expandedNavComponent.value = resolveComponent("LazyExpandedStopInfo") as string
    expandedNavProps.value = { stopInfo: props.stopInfo, handleHideSearch: handleHideSearch }
});

const handleHideSearch = () => {
    hideSearch.value = false;
    title.value = "Search";
};


onBeforeUnmount(() => {
    expandedNavComponent.value = null
    expandedNavProps.value = {}
});
onMounted(() => (title.value = "Stop Info"));
const checkNoOpBuses = (timing: string) => {
    if (timing === "-") {
        return "No Op";
    } else {
        return timing;
    }
};

const addColonInTime = (time: string) => {
    if (time.length === 4) {
        const hr = time.slice(0, 2);
        const min = time.slice(2);
        return hr + ":" + min;
    }
    return time;
};

const center = { lat: props.stopInfo.lattitude, lng: props.stopInfo.longitude }


</script>

<template>
    <div class="flex flex-col justify-center items-start gap-8 w-full mt-20">
        <GoogleMap style="width: 100%; height: 20rem;" :api-key="key" :zoom="17"
            :center="center" :zoom-control="false">
            <Marker :options="{ position: center, title: stopInfo.description }" />
        </GoogleMap>
        <!-- <div class="flex flex-col justify-center items-start gap-2 p-2 w-full text-bta-light dark:text-bta-dark ">
            <div ref="stopNameRef" class="flex flex-row justify-between items-center w-full">
                <h2 class="text-lg tracking-wide">
                    {{ stopInfo.code }}
                </h2>
                <IconsClose @click="handleHideSearch" class="fill-bta-dark dark:fill-bta-light"
                    :size="{ w: '32px', h: '32px' }" />
            </div>
            <div class="self-start">
                <p class="text-2xl">{{ stopInfo.description }}</p>
                <p class="text-lg">{{ stopInfo.street }}</p>
            </div>
        </div> -->
        <div class="flex flex-col justify-center items-start gap-4 text-bta-light dark:text-bta-dark p-2 w-full rounded-md"
            v-for="service of servicesTiming!">
            <!-- <div class="flex flex-col w-full gap-4"></div> -->

            <div class="grid grid-cols-3 w-full gap-2">
                <div class="flex flex-col justify-end items-start gap-2">
                    <button class="text-xl p-2 text-bta-light dark:text-bta-dark">
                        {{ service.service }}
                    </button>
                    <p>Weekday</p>
                    <p>Saturday</p>
                    <p>Sunday/PH</p>
                </div>
                <div class="flex flex-col justify-center items-center gap-2">
                    <p class="text-xl p-2">First Bus</p>
                    <p>{{ addColonInTime(service.wd_first) }}</p>
                    <p>
                        {{ addColonInTime(checkNoOpBuses(service.sat_first)) }}
                    </p>
                    <p>
                        {{ addColonInTime(checkNoOpBuses(service.sun_first)) }}
                    </p>
                </div>
                <div class="flex flex-col justify-center items-center gap-2">
                    <p class="text-xl p-2">Last Bus</p>
                    <p>{{ addColonInTime(service.wd_last) }}</p>
                    <p>
                        {{ addColonInTime(checkNoOpBuses(service.sat_last)) }}
                    </p>
                    <p>
                        {{ addColonInTime(checkNoOpBuses(service.sun_last)) }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
