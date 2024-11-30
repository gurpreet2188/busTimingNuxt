<script setup lang="ts">
import type { Ref } from "vue";
import type {
    Root as BUS_STOP_TYPES,
    Stop,
    StopQueryResponse,
    StopQuery,
} from "./types/stops";
import type { Root as BUS_INFO_TYPE } from "./types/bus";
import type { COMPONENT_STATE } from "./types/components";
import { ComponentsStateKeys, SubComponentStateKeys } from "./types/components";
import { useGeolocation } from "@vueuse/core";
import { busStore } from "./busFirebase/busStore";
import changeComponentState from "./helper/componentsState";
// import { useBusRoute } from "./composables/useBusRoute";

const isLoggedIn: Ref<string> = useState("isLoggedIn");
const { coords, locatedAt, error, resume, pause } = useGeolocation();
const skipLogIn: Ref<boolean> = useState("skipLogIn", () => false);
const settings: Ref<boolean> = useState("settings", () => false);
const currentUser = useCurrentUser();
const favsStops: Ref<Stop[] | []> = useState("favsStops", () => []);
const favStopsFromLocal: Ref<string[]> = useState("favs", () => []);
const filterFavs: Ref<Boolean> = useState("filterFavs", () => false);
const stops: Ref<BUS_STOP_TYPES> = useState("locstops", () => {
    return { stops: [] };
});
const darkTheme: Ref<boolean> = useState("darkTheme", () => false);
const location: Ref<{ lat: number; lon: number } | null> = ref(null);
const windowBlur: Ref<boolean> = useState("windowBlur", () => false);
const bodyOverFlow: Ref<string> = ref("overflow:auto");
const mainInterval: Ref<NodeJS.Timer | number | null> = ref(null);

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
            [SubComponentStateKeys.LOCATION]: true,
            [SubComponentStateKeys.FAVS]: false,
            [SubComponentStateKeys.ROUTE]: false,
        };
    },
);

const getData = async (lat: number, lon: number) => {
    const query: StopQuery = {
        nearest: { lat, lon },
    };
    const res: StopQueryResponse = await $fetch(`/api/get-stop-info`, {
        method: "POST",
        body: query,
    });
    return res.stops!!;
};

const LOGGEDINSTATE = {
    LOADING: "loading",
    IN: "loggedIn",
    OUT: "loggedOut",
};

watch(settings, () => {
    if (settings.value) {
        bodyOverFlow.value = "overflow:hidden";
    } else {
        bodyOverFlow.value = "overflow:auto";
    }
});

useHead({
    meta: [
        {
            name: "theme-color",
            content: darkTheme ? "#0d1b2a" : "#ffe5d9",
            media: "(prefers-color-scheme: light)",
        },
    ],
    bodyAttrs: {
        class: "min-h-full",
        style: bodyOverFlow,
    },
    htmlAttrs: { class: "min-h-full bg-[#f8edeb] dark:bg-[#0d1b2a]" },
});

watch(
    currentUser,
    () => {
        // useBusRoute("10");
        if (currentUser.value?.uid) {
            busStore().initialize(currentUser.value?.uid);
        } else {
            busStore().loadFromLocaStorage();
        }
    },
    { deep: true },
);

watchEffect(async () => {
    if (
        (favStopsFromLocal.value?.length! > 0 && favStopsFromLocal.value) ||
        filterFavs.value
    ) {
        const tempArr: Stop[] = [];
        for (const index in favStopsFromLocal.value) {
            const query: StopQuery = {
                single: favStopsFromLocal.value[index],
            };
            const stopData: StopQueryResponse = await $fetch(
                "/api/get-stop-info",
                {
                    method: "POST",
                    body: JSON.stringify(query),
                },
            );
            if (stopData?.stop) {
                tempArr[index] = stopData?.stop;
            }
            const services = await $fetch("/api/bus-info", {
                method: "POST",
                body: { stopCode: favStopsFromLocal.value[index] },
            });

            if (services.Services) {
                tempArr[index].Services = services.Services;
            }
        }
        favsStops.value = tempArr;
    }
});

onMounted(async () => {
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

watch(windowBlur, () => {
    const timeout = setTimeout(() => {
        // if (favsInterval.value && windowBlur.value) {
        //     clearInterval(favsInterval.value)
        // }

        if (mainInterval.value && windowBlur.value) {
            clearInterval(mainInterval.value as number);
        }
    }, 60000);

    if (!windowBlur.value) {
        if (timeout) {
            clearTimeout(timeout);
        }
    }
});

watchEffect(async () => {
    if (
        coords.value.latitude !== Infinity &&
        coords.value.longitude !== Infinity
    ) {
        pause();
        location.value = {
            lat: coords.value.latitude,
            lon: coords.value.longitude,
        };
    }
});

watch(
    currentUser,
    () => {
        if (currentUser.value) {
            componentsState.value = changeComponentState(
                ComponentsStateKeys.LOCATIONLOADING,
            );
            isLoggedIn.value = LOGGEDINSTATE.IN;
        } else {
            isLoggedIn.value = LOGGEDINSTATE.OUT;
            componentsState.value = changeComponentState(
                ComponentsStateKeys.WELCOME,
            );
        }
    },
    { deep: true },
);

watch(
    isLoggedIn,
    () => {
        if (isLoggedIn.value === LOGGEDINSTATE.IN) {
            componentsState.value = changeComponentState(
                ComponentsStateKeys.LOCATIONLOADING,
            );
        }
    },
    { deep: true },
);

// fetch services timing
async function fetchBusInfo() {
    if (stops.value.stops.length > 0) {
        for (const stop of stops.value.stops) {
            const data = await $fetch("/api/bus-info", {
                method: "POST",
                body: JSON.stringify({ stopCode: stop.BusStopCode }),
            });
            if (!data.error) {
                if (stop.BusStopCode === data.BusStopCode) {
                    stop.Services = data.Services!!;
                }
            }
        }
    }
}

// initial load
watch(
    [componentsState, location],
    async () => {
        if (componentsState.value[ComponentsStateKeys.LOCATIONLOADING]) {
            const loadData = async (lat: number, lon: number) => {
                stops.value.stops = await getData(lat, lon);
                fetchBusInfo();
                mainInterval.value = setInterval(async () => {
                    fetchBusInfo();
                }, 60000);
            };

            if (
                location.value &&
                (isLoggedIn.value === LOGGEDINSTATE.IN || skipLogIn.value)
            ) {
                // sample loc
                // loadData(1.29684825487647, 103.85253591654006);
                await loadData(location.value.lat, location.value.lon);
            }
        }
    },
    { deep: true },
);

watch(
    stops,
    () => {
        if (stops.value.stops.length > 0) {
            componentsState.value = changeComponentState(
                ComponentsStateKeys.LOADBUSINFO,
            );
        }
    },
    { deep: true },
);

onBeforeUnmount(() => {
    // if (favsInterval.value) {
    //     clearInterval(favsInterval.value)
    // }

    if (mainInterval.value) {
        clearInterval(mainInterval.value as number);
    }
});

const touchStartHandle = (e: string) => {
    if (e === "left") {
        window.scrollTo(0, 0);
        filterFavs.value = true;
    } else if (e === "right") {
        window.scrollTo(0, 0);
        filterFavs.value = false;
    }
};
</script>

<template>
    <div
        class="relative flex flex-col lg:w-[40%] md:w-[60%] h-full justify-start items-center gap-[1rem] w-[100%] p-[1rem] pb-[4rem] overflow-hidden bg-[#f8edeb] dark:bg-[#0d1b2a]"
    >
        <Navigation />

        <Welcome v-if="componentsState[ComponentsStateKeys.WELCOME]" />
        <LazyAuth v-if="componentsState[ComponentsStateKeys.LOGIN]" />
        <LoadingPage
            v-if="componentsState[ComponentsStateKeys.LOADING]"
            :darkTheme="darkTheme"
            :onlyBar="true"
            :location="location"
            :error="error"
        />
        <LoadingPage
            v-if="componentsState[ComponentsStateKeys.LOCATIONLOADING]"
            :darkTheme="darkTheme"
            :onlyBar="false"
            :location="location"
            :error="error"
        />
        <LazyLocBuses
            v-if="
                componentsState[ComponentsStateKeys.LOADBUSINFO] &&
                subComponentState[SubComponentStateKeys.LOCATION] &&
                stops.stops.length > 0
            "
            :stopsWithServices="stops"
        />
        <LazyFavsBusCards
            v-if="
                componentsState[ComponentsStateKeys.LOADBUSINFO] &&
                subComponentState[SubComponentStateKeys.FAVS] &&
                stops.stops.length > 0
            "
            :stopsWithServices="stops"
        />

        <LazySearch
            v-if="
                componentsState[ComponentsStateKeys.LOADBUSINFO] &&
                subComponentState[SubComponentStateKeys.ROUTE] &&
                stops.stops.length > 0
            "
        />
        <Footer
            :class="`fixed bottom-0 top-auto w-[100%] lg:w-[20%] lg:mb-2 h-[5%]`"
            v-if="componentsState[ComponentsStateKeys.LOADBUSINFO]"
        />
    </div>
    <div
        v-if="settings"
        class="absolute top-0 flex justify-center items-center z-10 h-[100vh] bg-black/50 w-[100%]"
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

/* .v-enter-active {
    animation: slideIn 0.5s;
}
@keyframes slideIn {
    from {
        translate: -200px 0;
        opacity: 0;
    }
    to {
        translate: 0 0;
        opacity: 1;
    }
}
.v-leave-active {
    animation: slideOut 0.5s;
}
@keyframes slideOut {
    from {
        translate: 0 0;
        opacity: 1;
    }
    to {
        translate: 200px 0;
        opacity: 0;
    }
} */
/* .v-enter-active {
    animation: slideIn 0.5s;
}
@keyframes slideIn {
    from {
        translate: -200px 0;
        opacity: 0;
    }
    to {
        translate: 0 0;
        opacity: 1;
    }
}
.v-leave-active {
    animation: slideOut 0.5s;
}
@keyframes slideOut {
    from {
        translate: 0 0;
        opacity: 1;
    }
    to {
        translate: 200px 0;
        opacity: 0;
    }
} */

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

/* .slide-fade-enter-active {
    transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
} */
</style>
