<script setup lang="ts">
import type { Stop } from "~/types/stops";
import { useCheckIfFavStop } from "~/composables/useCheckIfFavStop";
import { useGeolocation } from "@vueuse/core";
import fetchBusInfo from "~/helper/fetchData";

const { coords, locatedAt, error, resume, pause } = useGeolocation();
const showNav: Ref<boolean> = useState("showNav");
const refreshData: Ref<boolean> = useState("refreshData");
const animateRefresh: Ref<boolean> = useState("animateRefresh");
const bottomNavRoute: Ref<string> = useState("bottomNavRoute");
const stops: Ref<Stop[] | null> = useState("stopsArr", () => null);
const isLocationLoading: Ref<boolean> = useState("isLocationLoading");
const locationError: Ref<string> = useState("locationError", () => "");
const located: Ref<boolean> = useState("located");
const favStopsFromLocal: Ref<string[] | null> = useState("favs");
const isStopsError: Ref<boolean> = useState("isStopsError", () => false);
const darkTheme: Ref<boolean> = useState("darkTheme");
const title: Ref<string> = useState("title");
const errorMsg: Ref<string> = ref("");

// definePageMeta({
//   scrollToTop: true,
//   pageTransition: {name:"fade"}
// })

onMounted(async () => {
    bottomNavRoute.value = LOCATION_BASED;
    showNav.value = true;
    title.value = "Near By stops";

    if (stops.value && stops.value.length > 0) {
        return;
    }
    await getLocationBusTiming();
});

const getLocationBusTiming = async () => {
    // sample loc
    // stops.value = await getData(1.430786, 103.877458);
    // stops.value = await getData(1.40276, 103.890896);
    if (
        coords.value.latitude !== Infinity &&
        coords.value.longitude !== Infinity
    ) {
        pause();
        isLocationLoading.value = false;
        located.value = true;

        const isData = await getData(
            coords.value.latitude,
            coords.value.longitude,
        );
        if (isData.error) {
            isStopsError.value = true;
            errorMsg.value = isData.error;
            return;
        }

        stops.value = isData.data!;

        for (const stop of stops.value) {
            stop.servicesInfo = await fetchBusInfo(stop.code!!);
        }
    } else if (error.value) {
        isLocationLoading.value = false;
        locationError.value = error.value.message;
    }
};

const getData = async (
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
    await getLocationBusTiming();
    animateRefresh.value = false;
});

watch(
    coords,
    async () => {
        if (!stops.value) {
            await getLocationBusTiming();
        }
    },
    { deep: true },
);

const msg = computed((): string => {
    let m = "";
    if (isLocationLoading.value) {
        m = "Finding nearest Bus Stops...";
    } else if (locationError.value) {
        m = locationError.value;
    } else if (located.value && stops.value && stops.value!.length === 0) {
        isStopsError.value = true;
        m = "No stops found within 1km range.";
    }
    return m;
});
</script>

<template>
    <div
        class="flex flex-col justify-start items-center gap-4 mt-20 pb-20 w-full"
    >
        <BusCard
            v-if="stops && stops.length > 0"
            v-for="(stop, index) in stops!!"
            :fav="useCheckIfFavStop(stop.code!!, favStopsFromLocal!)"
            :stop-name="stop.description"
            :stop-code="stop.code"
            :bg-color-shift="index"
            :street-name="stop.street"
            :services="stop.servicesInfo"
            :distance-to-stop="stop.distance"
            :stop-pos="{ lat: stop.lattitude, lon: stop.longitude }"
            :key="stop.code!! + new Date().getTime()"
        />

        <LoadingPage
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
        />
    </div>
</template>
