<script setup lang="ts">
import type { Ref } from "vue";
import type { Root as BUS_STOP_TYPES } from "./types/stops";
import type { Root as BUS_STOPS } from "./types/bus";
import type { COMPONENT_STATE } from "./types/components";
import { ComponentsStateKeys, SubComponentStateKeys } from "./types/components";
import { useGeolocation } from "@vueuse/core";
import { busStore } from "./busFirebase/busStore";
import changeComponentState from "./helper/componentsState";
import { useBusRoute } from "./composables/useBusRoute";

const isLoggedIn: Ref<string> = useState("isLoggedIn");
const { coords, locatedAt, error, resume, pause } = useGeolocation();
const skipLogIn: Ref<boolean> = useState("skipLogIn", () => false);
const settings: Ref<boolean> = useState("settings", () => false);
const currentUser = useCurrentUser();
const favsStops: Ref<BUS_STOPS[] | []> = useState("favsStops", () => []);
const favStopsFromLocal: Ref<string[]> = useState("favs", () => []);
const filterFavs: Ref<Boolean> = useState("filterFavs", () => false);
const stops: Ref<BUS_STOP_TYPES> = ref({ stops: [] });
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
            [ComponentsStateKeys.LOADING]: false,
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

const getData = async (pos: { lat: number; lon: number }) => {
    const res = await fetch(`/api/find-nearest-stops`, {
        method: "POST",
        body: JSON.stringify(pos),
    });
    const data = await res.json();
    console.log(pos, data);
    return await data;
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
        const tempArr: BUS_STOPS[] = [];
        for (const index in favStopsFromLocal.value) {
            const stopData: BUS_STOPS = await $fetch("/api/stop-info", {
                method: "POST",
                body: { stopCode: favStopsFromLocal.value[index] },
            });
            if (stopData) {
                tempArr[index] = stopData;
            }
            const services: BUS_STOPS = await $fetch("/api/bus-info", {
                method: "POST",
                body: { stopCode: favStopsFromLocal.value[index] },
            });

            if (services) {
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
                ComponentsStateKeys.LOADING,
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

watchEffect(() => {
    if (isLoggedIn.value === LOGGEDINSTATE.IN) {
        componentsState.value = changeComponentState(
            ComponentsStateKeys.LOADING,
        );
    }
});

async function fetchBusInfo() {
    console.log(stops.value.stops);
    if (stops.value.stops.length > 0) {
        for (const stop of stops.value.stops) {
            const data: BUS_STOPS = await $fetch("/api/bus-info", {
                method: "POST",
                body: JSON.stringify({ stopCode: stop.BusStopCode }),
            });
            if (Object.keys(data).includes("Services")) {
                if (stop.BusStopCode === data.BusStopCode) {
                    stop.Services = data.Services;
                }
            }
        }
    }
    return stops;
}

watchEffect(() => {
    if (componentsState.value[ComponentsStateKeys.LOADING]) {
        const loadData = async (lat: number, lon: number) => {
            stops.value = await getData({ lat: lat, lon: lon });
            if (stops.value.stops.length > 0) {
                // componentsState.value = changeComponentState(
                //     ComponentsStateKeys.LOADING,
                // );
                fetchBusInfo();

                mainInterval.value = setInterval(async () => {
                    fetchBusInfo();
                }, 60000);
                componentsState.value = changeComponentState(
                    ComponentsStateKeys.LOADBUSINFO,
                );
            }
        };

        if (
            location.value &&
            (isLoggedIn.value === LOGGEDINSTATE.IN || skipLogIn.value)
        ) {
            // sample loc
            // loadData(1.33123, 103.838949);
            loadData(location.value.lat, location.value.lon);
        }
    }
});

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

const dynamicComponentProps = ref({});
const dynamicComponentKey = ref("");

const componentToRender = computed(() => {
    if (
        componentsState.value[ComponentsStateKeys.WELCOME] &&
        isLoggedIn.value !== LOGGEDINSTATE.LOADING
    ) {
        dynamicComponentKey.value = "welcome";
        dynamicComponentProps.value = {};
        return resolveComponent("Welcome");
    } else if (componentsState.value[ComponentsStateKeys.LOGIN]) {
        dynamicComponentKey.value = "auth";
        dynamicComponentProps.value = {};
        return resolveComponent("Auth");
    } else if (componentsState.value[ComponentsStateKeys.LOADING]) {
        dynamicComponentKey.value = "loadingPage";
        dynamicComponentProps.value = {
            darkTheme: darkTheme,
            location: location,
            error: error,
        };
        return resolveComponent("LazyLoadingPage");
    } else if (componentsState.value[ComponentsStateKeys.LOADBUSINFO]) {
        if (subComponentState.value[SubComponentStateKeys.FAVS]) {
            dynamicComponentKey.value = "FavsBusCards";
            dynamicComponentProps.value = {
                stopsWithServices: toRaw(stops.value),
            };
            return resolveComponent("LazyFavsBusCards");
        } else if (subComponentState.value[SubComponentStateKeys.LOCATION]) {
            dynamicComponentKey.value = "LocationBusCards";
            dynamicComponentProps.value = {
                stopsWithServices: toRaw(stops.value),
            };
            return resolveComponent("LazyLocBuses");
        } else if (subComponentState.value[SubComponentStateKeys.ROUTE]) {
            dynamicComponentKey.value = "Search";
            dynamicComponentProps.value = {};
            return resolveComponent("LazySearch");
        }
    }
});

watch(
    dynamicComponentKey,
    () => {
        console.log(dynamicComponentKey.value);
    },
    { deep: true },
);
</script>

<template>
    <div
        class="relative flex flex-col lg:w-[40%] md:w-[60%] h-full justify-start items-center gap-[1rem] w-[100%] p-[1rem] pb-[4rem] overflow-hidden"
        v-touch:swipe="touchStartHandle"
    >
        <Navigation />

        <div class="flex justify-center items-center flex-col w-full">
            <transition name="fade" mode="out-in">
                <component
                    :key="dynamicComponentKey"
                    :is="componentToRender"
                    v-bind="dynamicComponentProps"
                />
            </transition>
        </div>

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
