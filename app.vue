<script setup lang="ts">
import type { Ref } from "vue";
import type { Stop, StopQuery } from "./types/stops";
import type { COMPONENT_STATE } from "./types/components";
import { ComponentsStateKeys, SubComponentStateKeys } from "./types/components";
import { useGeolocation } from "@vueuse/core";
import { busStore } from "./busFirebase/busStore";
import changeComponentState from "./helper/componentsState";
import fetchBusInfo from "./helper/fetchData";

const skipWelcome: Ref<boolean> = useState("skipWelcome", () => false);
const isLoggedIn: Ref<string> = useState("isLoggedIn");
const { coords, locatedAt, error, resume, pause } = useGeolocation();
const isLocationLoading: Ref<boolean> = useState(
    "isLocationLoading",
    () => false,
);
const located: Ref<boolean> = useState("located", () => false);
const locationError: Ref<string> = useState("locationError", () => "");
const settings: Ref<boolean> = useState("settings", () => false);
const currentUser = useCurrentUser();
const favsStops: Ref<Stop[] | null> = useState("favsStops", () => null);
const favStopsFromLocal: Ref<string[]> = useState("favs", () => []);
const filterFavs: Ref<Boolean> = useState("filterFavs", () => false);
const stops: Ref<Stop[] | null> = useState("locstops", () => null);
const darkTheme: Ref<boolean> = useState("darkTheme", () => false);
const windowBlur: Ref<boolean> = useState("windowBlur", () => false);
const bodyOverFlow: Ref<string> = ref("overflow:auto");
const colorMode = useColorMode();
const animateRefresh: Ref<boolean> = useState("animateRefresh", () => false);
const componentsState: Ref<COMPONENT_STATE> = useState(
    "component_state",
    () => {
        return {
            [ComponentsStateKeys.WELCOME]: false,
            [ComponentsStateKeys.LOADBUSINFO]: false,
            [ComponentsStateKeys.LOADING]: true,
            [ComponentsStateKeys.LOCATIONLOADING]: false,
            [ComponentsStateKeys.LOGIN]: false,
        };
    },
);

const subComponentState: Ref<COMPONENT_STATE> = useState(
    "sub_component_state",
    () => {
        return {
            [SubComponentStateKeys.LOADING]: true,
            [SubComponentStateKeys.LOCATION]: false,
            [SubComponentStateKeys.FAVS]: false,
            [SubComponentStateKeys.ROUTE]: false,
        };
    },
);
const refreshData = useState("refreshData", () => false);
const LOGGEDINSTATE = {
    LOADING: "loading",
    IN: "loggedIn",
    OUT: "loggedOut",
};

const title: Ref<string> = useState("title", () => "");

const hideNav: Ref<boolean> = useState("hdieNav", () => false);

useHead({
    meta: [
        {
            name: "theme-color",
            content: darkTheme ? "#0d1b2a" : "#ffe5d9",
            media: "(prefers-color-scheme: light)",
        },
    ],
    bodyAttrs: {
        class: "min-h-screen",
        style: bodyOverFlow,
    },
    htmlAttrs: { class: "min-h-screen bg-bta-light dark:bg-bta-dark" },
});

onMounted(async () => {
    skipWelcome.value = JSON.parse(localStorage.getItem("skipWelcome")!!);
    watch(
        colorMode,
        () => {
            if (colorMode.preference === "system") {
                darkTheme.value = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                ).matches;
            } else {
                darkTheme.value =
                    colorMode.preference === "dark" ? true : false;
            }
        },
        { deep: true },
    );

    darkTheme.value = window.matchMedia("(prefers-color-scheme: dark)").matches;

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
            darkTheme.value = e.matches;
        });

    window.addEventListener("blur", (e) => {
        windowBlur.value = true;
    });

    window.addEventListener("focus", (e) => {
        windowBlur.value = false;
    });
});

watch(settings, () => {
    if (settings.value) {
        bodyOverFlow.value = "overflow:hidden";
    } else {
        bodyOverFlow.value = "overflow:auto";
    }
});

watch(
    [currentUser],
    () => {
        if (currentUser.value) {
            busStore().initialize(currentUser.value?.uid);
            componentsState.value = changeComponentState(
                ComponentsStateKeys.LOCATIONLOADING,
            );
            isLoggedIn.value = LOGGEDINSTATE.IN;
        } else if (skipWelcome.value) {
            busStore().loadFromLocaStorage();
            isLoggedIn.value = LOGGEDINSTATE.OUT;
            componentsState.value = changeComponentState(
                ComponentsStateKeys.LOCATIONLOADING,
            );
        } else {
            busStore().loadFromLocaStorage();
            isLoggedIn.value = LOGGEDINSTATE.OUT;
            componentsState.value = changeComponentState(
                ComponentsStateKeys.WELCOME,
            );
        }
    },
    { deep: true },
);

watch(
    [favStopsFromLocal, filterFavs],
    async () => {
        if (
            (favStopsFromLocal.value?.length! > 0 && favStopsFromLocal.value) ||
            filterFavs.value
        ) {
            getFavsBusTiming();

            animateRefresh.value = false;
        }
    },
    { immediate: true, deep: true },
);

watch(
    [refreshData],
    async () => {
        animateRefresh.value = true;
        if (subComponentState.value[SubComponentStateKeys.LOCATION]) {
            await getLocationBusTiming();
        } else if (subComponentState.value[SubComponentStateKeys.FAVS]) {
            await getFavsBusTiming();
        }
        nextTick(() => (animateRefresh.value = false));
    },
    { deep: true },
);

const getFavsBusTiming = async () => {
    const tempArr: Stop[] = [];
    for (const index in favStopsFromLocal.value) {
        const query: StopQuery = {
            single: favStopsFromLocal.value[index],
        };
        const stopData: Stop = await $fetch("/api/get-stops", {
            method: "POST",
            body: JSON.stringify(query),
        });
        if (stopData?.code) {
            tempArr[index] = stopData;
            tempArr[index].services = [];
        }
        tempArr[index].services = await fetchBusInfo(
            favStopsFromLocal.value[index],
        );
    }
    favsStops.value = tempArr;
};

watch(
    [componentsState],
    () => {
        if (componentsState.value[ComponentsStateKeys.LOCATIONLOADING]) {
            subComponentState.value = changeComponentState(
                SubComponentStateKeys.LOCATION,
                true,
            );
        }
    },
    { deep: true },
);

// initial load
watch(
    [componentsState, coords, refreshData],
    async () => {
        if (componentsState.value[ComponentsStateKeys.LOCATIONLOADING]) {
            isLocationLoading.value = true;
            getLocationBusTiming();
        }
    },
    { deep: true },
);

const getLocationBusTiming = async () => {
    // sample loc
    // stops.value = await getData(1.430786, 103.877458);
    // stops.value = await getData(1.40276, 103.890896);
    //
    if (
        coords.value.latitude !== Infinity &&
        coords.value.longitude !== Infinity &&
        (isLoggedIn.value === LOGGEDINSTATE.IN || skipWelcome.value)
    ) {
        pause();
        isLocationLoading.value = false;
        located.value = true;

        stops.value = await getData(
            coords.value.latitude,
            coords.value.longitude,
        );

        for (const stop of stops.value!!) {
            stop.services = await fetchBusInfo(stop.code!!);
        }
    } else if (error.value) {
        isLocationLoading.value = false;
        locationError.value = error.value.message;
    }
};

const getData = async (lat: number, lon: number) => {
    const query: StopQuery = {
        nearest: { lat, lon },
    };
    const res = await $fetch(`/api/get-stops`, {
        method: "POST",
        body: query,
    });
    return res!!;
};
</script>

<template>
    <div
        class="relative flex flex-col lg:w-[40%] md:w-[60%] h-screen justify-start items-center gap-[1rem] w-[100%] p-2 px-4 pb-[4rem]"
    >
        <Transition>
            <Header
                v-if="!componentsState[ComponentsStateKeys.WELCOME] && !hideNav"
                :title="title"
            />
        </Transition>
        <Welcome v-if="componentsState[ComponentsStateKeys.WELCOME]" />
        <div class="flex flex-col w-full pt-20">
            <LazyAuth v-if="componentsState[ComponentsStateKeys.LOGIN]" />
            <LoadingPage
                v-if="componentsState[ComponentsStateKeys.LOADING]"
                :darkTheme="darkTheme"
                :showBarOnly="true"
                :location="false"
            />
            <LazyLocBuses
                v-if="
                    componentsState[ComponentsStateKeys.LOCATIONLOADING] &&
                    subComponentState[SubComponentStateKeys.LOCATION]
                "
                :stopsWithServices="stops"
            />
            <LazyFavsBusCards
                v-if="
                    componentsState[ComponentsStateKeys.LOCATIONLOADING] &&
                    subComponentState[SubComponentStateKeys.FAVS]
                "
            />

            <LazySearch
                v-if="
                    componentsState[ComponentsStateKeys.LOCATIONLOADING] &&
                    subComponentState[SubComponentStateKeys.ROUTE]
                "
            />
        </div>
        <BottomNav
            :class="`fixed bottom-2 top-auto w-[100%] lg:w-[20%] lg:mb-2`"
            v-if="componentsState[ComponentsStateKeys.LOCATIONLOADING]"
        />
    </div>
    <div
        v-if="settings"
        class="fixed flex justify-center items-center z-20 h-screen bg-black/50 w-[100%]"
    >
        <Settings />
    </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.show-left {
    transform: translateX(52%);
}

.hide-left {
    transform: translateX(-54%);
    opacity: 0;
}

.hide-right {
    transform: translateX(100%);
    opacity: 0;
}

.show-right {
    transform: translateX(-52%);
}

.fly-in-enter-active {
    transform: translateY(0%);
    opacity: 1;
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.fly-in-leave-active {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.fly-in-enter-from {
    transform: translateY(60%);
    opacity: 0;
}

.fly-in-leave-to {
    opacity: 0;
    transform: translateY(40%);
}
</style>
