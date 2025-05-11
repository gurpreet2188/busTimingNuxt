<script setup lang="ts">
import type { Stop, BusService } from "~/types/stops";
import { useGeolocation } from "@vueuse/core";
import BusInfoCard from "~/components/busInfoCard.vue";
import ServiceCard from "../components/serviceCard.vue";
// import Pin from "~/components/base/busCard/pin.vue";
import useConvertUTCToMin from "~/composables/useConvertUTCToMin";
import useGetLocationInfo from "~/composables/useGetLocationInfo";
import useGetStopServices from "~/composables/useGetStopServices";
import Weather from "~/components/weather.vue";

const { coords, locatedAt, error, resume, pause } = useGeolocation();
const showNav: Ref<boolean> = useState("showNav");
const refreshData: Ref<boolean> = useState("refreshData");
const animateRefresh: Ref<boolean> = useState("animateRefresh");
const bottomNavRoute: Ref<string> = useState("bottomNavRoute");
const allStops: Ref<Stop[] | null> = useState("allStops", () => null);
const filteredStops: Ref<BusService[]> = useState("filteredStops", () => []);
const isLocationLoading: Ref<boolean> = useState("isLocationLoading");
const locationError: Ref<string> = useState("locationError", () => "");
const located: Ref<boolean> = useState("located");
const isStopsError: Ref<boolean> = useState("isStopsError", () => false);
// const darkTheme: Ref<boolean> = useState("darkTheme");
const title: Ref<string> = useState("title");
const errorMsg: Ref<string> = ref("");
const initialLoadTimeout: Ref<number> = ref(0);
const isDev = import.meta.dev;
const thisDiv: Ref<HTMLElement | null> = ref(null);
const weatherInfo: Ref<string | undefined> = ref(undefined);
// const stopItemRefs: Ref<HTMLElement[] | null> = ref(null);
const serviceButtons: Ref<{ [key: string]: boolean }> = useState(
    "serviceButtons",
    () => {
        return {};
    },
);
const activeService: Ref<string> = ref("");
const loadingServicesStatus: Ref<string | null> = ref(null);
const sampleLocation: { lat: number; lon: number } = SAMPLE_LOCATION.whitesands;
const refreshInterval: Ref<number> = ref(0);
const startRefreshInterval: Ref<boolean> = ref(false);
onBeforeMount(async () => {
    await useGetSavedStops();
    if (allStops.value?.length! > 0) {
        startRefreshInterval.value = true;
    }
});

onMounted(async () => {
    bottomNavRoute.value = LOCATION_BASED;
    showNav.value = true;
    title.value = "Near By";
    loadingServicesStatus.value = "Searching for active services...";
    // if (localStorage.getItem("saved")) {
    //     await getLocationBusTiming();
    // }
});

const getLocationBusTiming = async (onlyRefresh?: boolean) => {
    startRefreshInterval.value = true;
    // sample loc
    if (isDev) {
        let tempStops: Stop[] | null;
        tempStops = (
            await getLocationStopInfo(sampleLocation.lat, sampleLocation.lon)
        ).data;
        for (const stop of tempStops!) {
            stop.servicesInfo = await useFetchRealtimeBusInfo(stop.code!!);
        }
        getServices(tempStops!);
        getActiveServices(tempStops!);
        refreshFilteredStops(tempStops!);
        allStops.value = tempStops;
        return;
    }

    if (
        coords.value.latitude !== Infinity &&
        coords.value.longitude !== Infinity &&
        !isDev
    ) {
        pause();
        isLocationLoading.value = false;
        located.value = true;

        const isData = await getLocationStopInfo(
            coords.value.latitude,
            coords.value.longitude,
        );
        if (isData.error) {
            isStopsError.value = true;
            errorMsg.value = isData.error;
            return;
        }

        let tempStops = isData.data!;

        for (const stop of tempStops) {
            stop.servicesInfo = await useFetchRealtimeBusInfo(stop.code!);
        }

        allStops.value = tempStops;
        getServices(tempStops);
        getActiveServices(tempStops);
        refreshFilteredStops(allStops.value);
    } else if (error.value) {
        isLocationLoading.value = false;
        locationError.value = error.value.message;
    }
};

watch(
    startRefreshInterval,
    () => {
        console.log(startRefreshInterval.value);
        if (startRefreshInterval.value) {
            refreshInterval.value = window.setInterval(async () => {
                await getLocationBusTiming(true);
            }, 25000);
        }
    },
    { deep: true },
);

const getServices = async (stops: Stop[]) => {
    let tempServices: { [key: string]: boolean } = {};
    for (const stop of stops) {
        await useGetStopServices(stop.code).then((d) => {
            for (const s of d!) {
                if (!Object.keys(tempServices).includes(s)) {
                    tempServices[s] = false;
                }
            }
        });
    }

    for (const service of Object.keys(tempServices)) {
        for (const stop of stops) {
            if (useCheckIfActiveService(stop.servicesInfo!, service)) {
                tempServices[service] = true;
                break;
            }
        }
    }
    // tempServices = tempServices.sort(
    //      (a, b) => parseInt(a) - parseInt(b),
    //  )

    serviceButtons.value = tempServices;
};
const getActiveServices = (stops: Stop[]) => {
    let tempServices: string[] = [];
    for (const stop of stops) {
        if (!(stop.servicesInfo?.length! > 0)) {
            return;
        }
        for (const service of stop.servicesInfo!) {
            if (!tempServices.includes(service.ServiceNo)) {
                tempServices.push(service.ServiceNo);
            }
        }
    }
    // tempServices.length > 0
    //     ? (serviceButtons.value = tempServices.sort(
    //           (a, b) => parseInt(a) - parseInt(b),
    //       ))
    //     : [];
};

const getLocationStopInfo = async (
    lat: number,
    lon: number,
): Promise<{ data: Stop[] | null; error: any | null }> => {
    const query = { lat, lon };
    return await $fetch(`/api/get-nearest`, {
        method: "POST",
        body: query,
    });
};

watch([refreshData], async () => {
    animateRefresh.value = true;
    // serviceButtons.value = [];
    await getLocationBusTiming(true);
    animateRefresh.value = false;
});

watch(
    coords,
    async () => {
        if (!allStops.value) {
            await getLocationBusTiming();
        }
        // const locInfo = await useGetLocationInfo(
        //     sampleLocation.lat,
        //     sampleLocation.lon,
        // );
        // console.log(locInfo);
        // if (locInfo && locInfo.status === "OK") {
        //     title.value = locInfo.results[0].formatted_address.split(",")[0];
        // }
        if (coords.value.latitude !== Infinity) {
            weatherInfo.value = await $fetch("/api/weather-info", {
                method: "POST",
                body: {
                    lat: coords.value.latitude,
                    lon: coords.value.longitude,
                },
            });
            const locInfo = await useGetLocationInfo(
                coords.value.latitude,
                coords.value.longitude,
            );
            if (locInfo && locInfo.status === "OK") {
                title.value =
                    locInfo.results[0].formatted_address.split(",")[0];
            }
        }
        if (Object.entries(activeService).length === 0) {
            loadingServicesStatus.value = "No Active Service found near by.";
        } else {
            loadingServicesStatus.value = null;
        }
    },
    { deep: true },
);

// const msg = computed((): string => {
//     let m = "";
//     if (isLocationLoading.value) {
//         m = "Finding nearest Bus Stops...";
//     } else if (locationError.value) {
//         m = locationError.value;
//     } else if (
//         located.value &&
//         Object.keys(serviceButtons.value).length === 0
//     ) {
//         isStopsError.value = true;
//         m = "No stops found within 1km range.";
//     }
//     return m;
// });

const handleServiceEvent = (serviceNo: string) => {
    filteredStops.value = [];

    if (activeService.value === serviceNo) {
        activeService.value = "";
        return;
    }

    activeService.value = serviceNo;
    for (const stop of allStops.value!) {
        let isServiceIncluded = false;
        for (const fs of filteredStops.value) {
            if (fs.id === stop.code + serviceNo) {
                isServiceIncluded = true;
                break;
            }
        }
        if (isServiceIncluded) {
            filteredStops.value = filteredStops.value.filter(
                (v) => v.serviceNo !== serviceNo,
            );
            return;
        }

        stop.servicesInfo?.forEach((v) => {
            if (v.ServiceNo === serviceNo) {
                v.NextBus!.EstimatedArrivalMinutes = useConvertUTCToMin(
                    v.NextBus?.EstimatedArrival as string,
                );
                v.NextBus2!.EstimatedArrivalMinutes = useConvertUTCToMin(
                    v.NextBus2?.EstimatedArrival as string,
                );
                v.NextBus3!.EstimatedArrivalMinutes = useConvertUTCToMin(
                    v.NextBus3?.EstimatedArrival as string,
                );
                const tempService = {
                    id: stop.code + serviceNo,
                    serviceNo: serviceNo,
                    bus: v,
                    stopCode: stop.code,
                    stopName: stop.description,
                    show: true,
                    distance: stop.distance,
                };

                filteredStops.value.push(tempService);
            }
        });
        // if (filteredStops.value.length === 0) {
        //     const tempService = {
        //         id: stop.code + serviceNo,
        //         serviceNo: serviceNo,
        //         stopCode: stop.code,
        //         stopName: stop.description,
        //         show: true,
        //         distance: stop.distance,
        //     };
        //     filteredStops.value.push(tempService);
        //     console.log(filteredStops.value);
        //     return;
        // }
    }
};

const refreshFilteredStops = (stops: Stop[]) => {
    const deleteEntry: { [key: string]: boolean } = {};

    for (const f of filteredStops.value) {
        deleteEntry[f.id] = true;
    }
    for (const stop of stops) {
        if (!(stop.servicesInfo?.length! > 0)) {
            return;
        }
        if (stop.servicesInfo)
            for (const service of stop.servicesInfo!) {
                for (const fs of filteredStops.value) {
                    if (fs.id === stop.code + service.ServiceNo && fs.bus) {
                        deleteEntry[fs.id] = false;
                        fs.bus.NextBus = service.NextBus
                            ? service.NextBus
                            : undefined;
                        fs.bus.NextBus2 = service.NextBus2
                            ? service.NextBus2
                            : undefined;
                        fs.bus.NextBus3 = service.NextBus3
                            ? service.NextBus3
                            : undefined;
                        fs.bus.NextBus!.EstimatedArrivalMinutes =
                            useConvertUTCToMin(
                                service.NextBus?.EstimatedArrival as string,
                            );
                        fs.bus.NextBus2!.EstimatedArrivalMinutes =
                            useConvertUTCToMin(
                                service.NextBus2?.EstimatedArrival as string,
                            );

                        fs.bus.NextBus3!.EstimatedArrivalMinutes =
                            useConvertUTCToMin(
                                service.NextBus3?.EstimatedArrival as string,
                            );
                    }
                }
            }
    }

    for (const k of Object.keys(deleteEntry)) {
        if (deleteEntry[k]) {
            filteredStops.value = filteredStops.value.filter((v) => v.id !== k);
        }
    }
};

// watch(filteredStops, () => console.log(filteredStops.value), { deep: true });

onBeforeUnmount(() => {
    window.clearTimeout(initialLoadTimeout.value);
    window.clearInterval(refreshInterval.value);
});
</script>

<template>
    <div
        ref="thisDiv"
        class="flex flex-col justify-center items-center gap-8 mt-20 pb-20 w-full"
    >
        <Weather v-if="weatherInfo" :weather-conditon="weatherInfo" />
        <p
            v-if="loadingServicesStatus"
            class="text-bta-950 dark:text-bta-50 font-extrabold"
        >
            {{ loadingServicesStatus }}
        </p>
        <ServiceCard
            v-else-if="!loadingServicesStatus && allStops"
            @service-event="handleServiceEvent"
            :stops="allStops?.length!"
            :services="serviceButtons"
            :active-service="activeService"
        />
        <!-- <TransitionGroup
            name="btn-fade"
            tag="div"
            appear
            class="bg-bta-100 dark:bg-bta-800 rounded-lg shadow-md w-full"
        >
            <button
                class="justify-self-start p-4 bg-bta-300 dark:bg-bta-700 w-full rounded-tl-lg rounded-tr-lg"
            >
                <p
                    class="font-bold text-bta-900 dark:text-bta-50 text-sm text-left"
                >
                    Found so many stops and services
                </p>
            </button>
            <div
                class="relative grid grid-cols-5 place-items-center gap-2 p-4 w-full"
            >
                <button
                    @click="() => handleShowBusService(service)"
                    v-for="service in serviceButtons"
                    :key="service"
                    class="bg-bta-300 dark:bg-bta-700 rounded-lg p-2 text-lg text-bta-900 dark:text-bta-50 font-bold text-center min-w-[4rem]"
                >
                    {{ service }}
                </button>
            </div>
        </TransitionGroup> -->

        <TransitionGroup
            v-if="Object.keys(serviceButtons).length > 0"
            name="left-slide"
            tag="div"
            class="relative flex flex-col justify-start items-center gap-8 w-full"
            appear
        >
            <BusInfoCard
                v-for="service in filteredStops"
                :bus-service="service"
                :key="service.id"
            />
        </TransitionGroup>

        <!-- <BusCard
            v-if="stops && stops.length > 0"
            v-for="(stop, index) in stops!!"
            ref="stopItemRefs"
            :stop-name="stop.description"
            :stop-code="stop.code"
            :bg-color-shift="index"
            :street-name="stop.street"
            :services="stop.servicesInfo"
            :distance-to-stop="stop.distance"
            :stop-pos="{ lat: stop.lattitude, lon: stop.longitude }"
            :key="stop.code!"
        />

         -->

        <!-- <LoadingPage
            v-else-if="
                locationError.length > 0 || isStopsError || errorMsg.length > 0
            "
            :showBarOnly="false"
            :darkTheme="darkTheme"
            :location="isLocationLoading"
            :error="
                locationError.length > 0 || isStopsError || errorMsg.length > 0
            "
            :msg="msg || errorMsg"
        />

        <LoadingPage
            v-else
            :showBarOnly="true"
            :location="false"
            :error="false"
            :msg="msg || errorMsg"
        /> -->
    </div>
</template>
<style>
.left-slide-enter-active,
.left-slide-leave-active {
    transition: all 500ms ease;
}

.left-slide-enter-from,
.left-slide-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.left-slide-leave-active {
    position: absolute;
}

.btn-fade-enter-active,
.btn-fade-leave-active {
    transition: all 200ms ease;
}

.btn-fade-enter-from,
.btn-fade-leave-to {
    opacity: 0;
}
</style>
