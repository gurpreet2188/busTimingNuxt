<script setup lang="ts">
import type { Stop } from "../types/stops";
import { SAVED } from "#build/imports";
import useGetSavedStops from "../composables/useGetSavedStops";
const bottomNavRoute: Ref<string> = useState("bottomNavRoute");
const showNav: Ref<boolean> = useState("showNav");
const refreshData: Ref<boolean> = useState("refreshData");
const animateRefresh: Ref<boolean> = useState("animateRefresh");
const savedStops: Ref<Stop[] | null> = useState("savedStops", () => []);
const savedStopsFromLocal: Ref<string[]> = useState(
    "savedStopsFromLocal",
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
        !savedStops.value ||
        !(savedStops.value.length > 0) ||
        savedStops.value!.length !== savedStopsFromLocal.value.length
    ) {
        await useGetSavedStops();
        await getFavsBusTiming();
    }
});

const loadFromBusStore = () => {};

const getFavsBusTiming = async () => {
    showEmptyFavsMessage.value = true;
    favLoadingMsg.value = "Loading Saved Bus Stops";
    let tempArr: Stop[] = [];
    for (const index in savedStopsFromLocal.value) {
        const query = {
            code: savedStopsFromLocal.value[index],
        };
        const stopData: { data: Stop[] | null; error: any | null } =
            await $fetch("/api/get-stop", {
                method: "POST",
                body: JSON.stringify(query),
            });
        if (stopData.error && !stopData.data) {
            tempArr = [];
            errorMsg.value = stopData.error;
            return;
        }

        tempArr[index] = stopData.data![0];
        tempArr[index].servicesInfo = [];

        tempArr[index].servicesInfo = await useFetchRealtimeBusInfo(
            savedStopsFromLocal.value[index],
        );
    }
    savedStops.value = tempArr;
    if (tempArr.length === 0) {
        favLoadingMsg.value = "Found 0 saved Bus Stops";
    }
};

watch(
    refreshData,
    async () => {
        animateRefresh.value = true;
        loadFromBusStore();
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
        for (let i = 0; i < savedStops.value!.length; i++) {
            if (savedStops.value![i].code === removedCode.value!) {
                index = i;
            }
        }

        savedStops.value!.splice(index, 1);
    },
    { deep: true },
);

watch(
    savedStops,
    () => {
        showEmptyFavsMessage.value =
            !savedStops.value || savedStops.value!!.length === 0;
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
                <BusCard
                    v-for="(stop, index) in savedStops"
                    :stop-name="stop.description"
                    :stop-code="stop.code"
                    :bg-color-shift="index"
                    :street-name="stop.street"
                    :services="stop.servicesInfo"
                    :distance-to-stop="stop.distance"
                    :stop-pos="{ lat: stop.lattitude, lon: stop.longitude }"
                    :key="stop.code"
                />
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
