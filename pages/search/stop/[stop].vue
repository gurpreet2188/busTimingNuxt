<script setup lang="ts">
import type { ServiceTiming, Stop } from "~/types/stops";
import { GoogleMap, Marker } from "vue3-google-map";
import { Error } from "#components";

const route = useRouter().currentRoute.value;
const showNav: Ref<boolean> = useState("showNav");
const center: Ref<{ lat: number; lng: number } | null> = ref(null);
const key = useRuntimeConfig();
const errorMsg: Ref<string | null> = ref(null);
const expandedNavComponent: Ref<string | null> = useState(
    "expandedNavComponent",
);
const expandedNavProps: Ref<{}> = useState("expandedNavProps");
const stop: Ref<Stop | null> = useState("singleStop", () => null);
const title: Ref<string> = useState("title");
const bottomNavRoute: Ref<string> = useState("bottomNavRoute");
const servicesTiming: Ref<ServiceTiming[] | null> = useState(
    "serviceTiming",
    () => null,
);
definePageMeta({
    scrollToTop: true,
});
onBeforeMount(async () => {
    bottomNavRoute.value = SEARCH;
    title.value = "Stop Info";
    showNav.value = true;

    if (!route.params.stop) {
        return;
    }

    // const stopRes: { data: Stop[] | null; error: any | null } = await $fetch(
    //     "/api/get-stop",
    //     {
    //         method: "POST",
    //         body: JSON.stringify({ code: route.params.stop }),
    //     },
    // );

    const stopInfo = await useGetCachedStopInfo(route.params.stop as string);
    if (!stopInfo) {
        errorMsg.value = "Error getting Stop info";
        return;
    }

    stop.value = stopInfo;

    const serviceTimingRes: {
        data: ServiceTiming[] | null;
        error: any | null;
    } = await $fetch("/api/get-services", {
        body: { code: stop.value.code },
        method: "POST",
    });
    if (serviceTimingRes.error) {
        errorMsg.value = serviceTimingRes.error;
        return;
    }
    servicesTiming.value = serviceTimingRes.data!;
    expandedNavComponent.value = resolveComponent(
        "LazyExpandedStopInfo",
    ) as string;
    expandedNavProps.value = {
        stopInfo: stop.value,
        handleHideSearch: handleHideSearch,
    };

    center.value = { lat: stop.value.lattitude, lng: stop.value.longitude };
});

onBeforeUnmount(() => {
    expandedNavComponent.value = null;
    expandedNavProps.value = {};
});

const handleHideSearch = async () => {
    await navigateTo(SEARCH);
    title.value = "Search";
};

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

const filteredServices: Ref<ServiceTiming[]> = useState(() => []);

watch(
    servicesTiming,
    () => {
        const filterDepartures = (
            services: ServiceTiming[],
        ): ServiceTiming[] => {
            let serviceCounts: { [key: string]: number } = {};
            for (const s of services) {
                if (serviceCounts[s.service]) {
                    serviceCounts[s.service] += 1;
                } else {
                    serviceCounts[s.service] = 1;
                }
            }
            let tempServices = [];
            for (const d of Object.keys(serviceCounts)) {
                if (serviceCounts[d] === 2) {
                    for (const s of services) {
                        if (
                            s.service === d &&
                            s.id.slice((s.code + s.service).length + 1) === "1"
                        ) {
                            tempServices.push(toRaw(s));
                        }
                    }
                } else if (serviceCounts[d] === 1) {
                    for (const s of services) {
                        if (s.service === d) {
                            tempServices.push(toRaw(s));
                        }
                    }
                }
            }
            return tempServices;
        };

        if (servicesTiming.value) {
            filteredServices.value = filterDepartures(servicesTiming.value);
        }
    },
    { deep: true },
);
</script>

<template>
    <div
        v-if="stop && servicesTiming"
        class="flex flex-col justify-center items-start gap-8 w-full mt-56 pb-24"
    >
        <GoogleMap
            style="width: 100%; height: 20rem"
            :api-key="key.public?.GMAP_KEY as string"
            :zoom="17"
            :center="center!"
            :zoom-control="false"
        >
            <Marker
                :options="{ position: center!, title: stop!.description }"
            />
        </GoogleMap>
        <div
            class="flex flex-col justify-center items-start gap-4 text-bta-light dark:text-bta-dark p-2 w-full rounded-md"
            v-for="service of filteredServices"
        >
            <div class="grid grid-cols-3 w-full gap-2">
                <div class="flex flex-col justify-end items-start gap-2">
                    <button
                        class="text-xl p-2 text-bta-light dark:text-bta-dark"
                    >
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
    <div v-else>
        <Error :msg="errorMsg!" />
    </div>
</template>
