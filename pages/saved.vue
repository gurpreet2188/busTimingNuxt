<script setup lang="ts">
import type { BusService, Stop } from "../types/stops";
import { SAVED } from "#build/imports";
import useGetSavedStops from "../composables/useGetSavedStops";
import BusInfoCard from "~/components/busInfoCard.vue";
const bottomNavRoute: Ref<string> = useState("bottomNavRoute");
const showNav: Ref<boolean> = useState("showNav");
const refreshData: Ref<boolean> = useState("refreshData");
const animateRefresh: Ref<boolean> = useState("animateRefresh");
const savedServices: Ref<BusService[] | null> = useState(
    "savedServices",
    () => [],
);
const savedServicesFromLocal: Ref<string[]> = useState(
    "savedServicesFromLocal",
    () => [],
);
const removedCode: Ref<string | boolean> = useState("removedCode");
const addedCode: Ref<string | boolean> = useState("addedCode");
const showEmptyFavsMessage: Ref<boolean> = ref(false);
const title: Ref<string> = useState("title");
const errorMsg: Ref<string> = ref("");
const favLoadingMsg: Ref<string> = ref("Loading Saved Bus Stops");
bottomNavRoute.value = SAVED;

onBeforeMount(async () => {
    showNav.value = true;
    title.value = "Saved Stops";

    if (
        !savedServices.value ||
        !(savedServices.value.length > 0) ||
        savedServices.value!.length !== savedServicesFromLocal.value.length
    ) {
        await useGetSavedStops();
        await getFavsBusTiming();
    }
});

const getFavsBusTiming = async () => {
    showEmptyFavsMessage.value = true;
    favLoadingMsg.value = "Loading Saved Bus Stops";

    let stops: string[] = [];

    for (const index in savedServicesFromLocal.value) {
        stops.push(savedServicesFromLocal.value[index].split("-")[1]);
    }
    stops = [...new Set(stops)];

    let tempArr: BusService[] = [];
    for (const index in stops) {
        const query = {
            code: stops[index],
        };
        const stopData: { data: Stop[] | null; error: any | null } =
            await $fetch("/api/get-stop", {
                method: "POST",
                body: query,
            });

        if (stopData.error && !stopData.data) {
            tempArr = [];
            errorMsg.value = stopData.error;
            return;
        }

        const tempStopBusTimingInfo = await useFetchRealtimeBusInfo(
            stops[index],
        );

        savedServicesFromLocal.value.forEach((v) => {
            tempStopBusTimingInfo.forEach((s) => {
                if (
                    v.split("-")[1] === stops[index] &&
                    v.split("-")[0] === s.ServiceNo
                ) {
                    s.NextBus!.EstimatedArrivalMinutes = useConvertUTCToMin(
                        s.NextBus?.EstimatedArrival as string,
                    );
                    s.NextBus2!.EstimatedArrivalMinutes = useConvertUTCToMin(
                        s.NextBus2?.EstimatedArrival as string,
                    );
                    s.NextBus3!.EstimatedArrivalMinutes = useConvertUTCToMin(
                        s.NextBus3?.EstimatedArrival as string,
                    );
                    tempArr.push({
                        id: s.ServiceNo + stops[index],
                        stopName: stopData.data![0].description,
                        stopCode: stopData.data![0].code,
                        distance: 0,
                        serviceNo: s.ServiceNo,
                        bus: s,
                    });
                }
            });
        });
    }

    savedServices.value = tempArr;
    console.log(savedServices.value);
    if (tempArr.length === 0) {
        favLoadingMsg.value = "Found 0 saved Bus Stops";
    }
};

watch(
    [refreshData, savedServicesFromLocal],
    async () => {
        animateRefresh.value = true;
        await getFavsBusTiming();
        animateRefresh.value = false;
    },
    { deep: true },
);

watch(
    removedCode,
    async () => {
        if (!removedCode.value) {
            return;
        }
        let index = -1;
        for (let i = 0; i < savedServices.value!.length; i++) {
            // if (savedServices.value![i].code === removedCode.value!) {
            //     index = i;
            // }
        }

        savedServices.value!.splice(index, 1);
    },
    { deep: true },
);

watch(
    savedServices,
    () => {
        showEmptyFavsMessage.value =
            !savedServices.value || savedServices.value!!.length === 0;
    },
    { deep: true, immediate: true },
);
</script>

<template>
    <div
        class="flex flex-col justify-start items-center gap-2 mt-20 pb-20 w-full"
    >
        <div
            v-if="showEmptyFavsMessage && errorMsg.length === 0"
            class="flex flex-col justify-center items-center gap-4 w-[100%] h-[80vh] overflow-hidden justify-self-center"
        >
            <IconsBusStop :size="{ w: '48px', h: '48px' }" />
            <p
                class="text-center tracking-wider text-bta-light dark:text-bta-dark"
            >
                {{ favLoadingMsg }}
            </p>
        </div>
        <LoadingPage
            v-else-if="errorMsg.length > 0"
            :showBarOnly="false"
            :location="false"
            :error="errorMsg.length > 0"
            :msg="errorMsg"
        />
        <div
            v-else
            class="flex flex-col justify-start items-center gap-2 w-full"
        >
            <TransitionGroup
                name="bslist"
                tag="div"
                class="flex flex-col gap-4 w-[100%]"
            >
                <BusInfoCard
                    v-for="service of savedServices"
                    :bus-service="service"
                    :key="service.id"
                />
                <!-- <BusCard
                    v-for="(stop, index) in savedStops"
                    :stop-name="stop.description"
                    :stop-code="stop.code"
                    :bg-color-shift="index"
                    :street-name="stop.street"
                    :services="stop.servicesInfo"
                    :distance-to-stop="stop.distance"
                    :stop-pos="{ lat: stop.lattitude, lon: stop.longitude }"
                    :key="stop.code"
                /> -->
            </TransitionGroup>
        </div>
    </div>
</template>

<style>
.bslist-move,
.bslist-enter-active,
.bslist-leave-active {
    transition: all 0.7s ease;
}

.bslist-enter-from,
.bslist-leave-to {
    opacity: 0;
    transform: translateX(200%);
}

.bslist-leave-active {
    position: absolute;
}
</style>
