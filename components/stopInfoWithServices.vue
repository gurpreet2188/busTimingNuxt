<script setup lang="ts">
import type { ServiceTiming, Stop } from "~/types/stops";
import type { COMPONENT_STATE } from "~/types/components";
import { SubComponentStateKeys } from "~/types/components";

const hideSearch: Ref<boolean> = useState("hideSearch");
const props = defineProps<{ stopInfo: Stop }>();
const title: Ref<string> = useState("title");
const expandNav = useState("expandNav", () => false);
const expandedNavData = useState("expandedNavData", () => "");
const subComponentState: Ref<COMPONENT_STATE> = useState("sub_component_state");
const servicesTiming: Ref<ServiceTiming[] | null> = useState(
    "serviceTiming",
    () => null,
);
const stopNameRef: Ref<HTMLElement | null> = ref(null);

const lastScroll: Ref<number> = useState("searchLastScroll");

onBeforeMount(async () => {
    servicesTiming.value = await $fetch("/api/get-services", {
        body: { single: props.stopInfo.code },
        method: "POST",
    });
});

const handleHideSearch = () => {
    hideSearch.value = false;
    title.value = "Search";
    expandNav.value = false;
    expandedNavData.value = "";
};

const ib = new IntersectionObserver(
    (entries, observer) => {
        for (const e of entries) {
            if (
                !e.isIntersecting &&
                subComponentState.value[SubComponentStateKeys.ROUTE]
            ) {
                (e.target as HTMLElement).classList.add("hide-service-name");
                expandNav.value = true;
                expandedNavData.value = props.stopInfo.description;
            } else if (
                !hideSearch.value ||
                !subComponentState.value[SubComponentStateKeys.ROUTE] ||
                e.isIntersecting
            ) {
                (e.target as HTMLElement).classList.remove("hide-service-name");
                expandNav.value = false;
                expandedNavData.value = "";
            }
        }

        return () => observer.disconnect();
    },
    { rootMargin: "-100px" },
);

onMounted(() => {
    ib.observe(stopNameRef.value as HTMLElement);
});

onBeforeUnmount(() => {
    ib.unobserve(stopNameRef.value as HTMLElement);
    expandNav.value = false;
    expandedNavData.value = "";
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
</script>

<template>
    <div class="flex flex-col justify-center items-start gap-8 w-full">
        <div
            class="flex flex-col justify-center items-start gap-2 p-2 w-full text-bta-dark dark:text-bta-dark rounded-md bg-bta-elevated-light dark:bg-bta-elevated-dark"
        >
            <div
                ref="stopNameRef"
                class="flex flex-row justify-between items-center w-full"
            >
                <h2 class="text-4xl tracking-wide">
                    {{ stopInfo.code }}
                </h2>
                <IconsClose
                    @click="handleHideSearch"
                    class="fill-bta-dark dark:fill-bta-light"
                    :size="{ w: '32px', h: '32px' }"
                />
            </div>
            <div class="self-start">
                <p class="text-lg">{{ stopInfo.description }}</p>
                <p class="text-lg">{{ stopInfo.street }}</p>
            </div>
        </div>
        <div
            class="flex flex-col justify-center items-start gap-4 text-bta-light dark:text-bta-dark p-2 w-full rounded-md"
            v-for="service of servicesTiming!"
        >
            <!-- <div class="flex flex-col w-full gap-4"></div> -->

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
</template>
