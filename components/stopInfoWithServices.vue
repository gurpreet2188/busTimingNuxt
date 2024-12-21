<script setup lang="ts">
import type { RestructuredStops } from "~/types/stops";
import type { COMPONENT_STATE } from "~/types/components";
import { SubComponentStateKeys } from "~/types/components";
import { addComponent } from "@nuxt/kit";
const hideSearch: Ref<boolean> = useState("hideSearch");
const props = defineProps<{ stopInfo: RestructuredStops }>();
const title: Ref<string> = useState("title");
const expandNav = useState("expandNav", () => false);
const expandedNavData = useState("expandedNavData", () => "");
const subComponentState: Ref<COMPONENT_STATE> = useState("sub_component_state");
const handleHideSearch = () => {
    hideSearch.value = false;
    title.value = "Search";
    expandNav.value = false;
    expandedNavData.value = "";
};

const stopNameRef: Ref<HTMLElement | null> = ref(null);

const ib = new IntersectionObserver(
    (entries, observer) => {
        for (const e of entries) {
            if (
                !e.isIntersecting &&
                subComponentState.value[SubComponentStateKeys.ROUTE]
            ) {
                (e.target as HTMLElement).classList.add("hide-service-name");
                expandNav.value = true;
                expandedNavData.value = props.stopInfo.Description;
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
                    {{ stopInfo.BusStopCode }}
                </h2>
                <IconsClose
                    @click="handleHideSearch"
                    class="fill-bta-dark dark:fill-bta-light"
                    :size="{ w: '32px', h: '32px' }"
                />
            </div>
            <div class="self-start">
                <p class="text-lg">{{ stopInfo.Description }}</p>
                <p class="text-lg">{{ stopInfo.RoadName }}</p>
            </div>
        </div>
        <div
            class="flex flex-col justify-center items-start gap-4 text-bta-light dark:text-bta-dark p-2 w-full rounded-md"
            v-for="service of Object.entries(stopInfo.Service)"
        >
            <!-- <div class="flex flex-col w-full gap-4"></div> -->

            <div class="grid grid-cols-3 w-full gap-2">
                <div class="flex flex-col justify-end items-start gap-2">
                    <button
                        class="text-xl p-2 text-bta-light dark:text-bta-dark"
                    >
                        {{ service[1].ServiceNo }}
                    </button>
                    <p>Weekday</p>
                    <p>Saturday</p>
                    <p>Sunday/PH</p>
                </div>
                <div class="flex flex-col justify-center items-center gap-2">
                    <p class="text-xl p-2">First Bus</p>
                    <p>{{ addColonInTime(service[1].WD_FirstBus) }}</p>
                    <p>
                        {{
                            addColonInTime(
                                checkNoOpBuses(service[1].SAT_FirstBus),
                            )
                        }}
                    </p>
                    <p>
                        {{
                            addColonInTime(
                                checkNoOpBuses(service[1].SUN_FirstBus),
                            )
                        }}
                    </p>
                </div>
                <div class="flex flex-col justify-center items-center gap-2">
                    <p class="text-xl p-2">Last Bus</p>
                    <p>{{ addColonInTime(service[1].WD_LastBus) }}</p>
                    <p>
                        {{
                            addColonInTime(
                                checkNoOpBuses(service[1].SAT_LastBus),
                            )
                        }}
                    </p>
                    <p>
                        {{
                            addColonInTime(
                                checkNoOpBuses(service[1].SUN_LastBus),
                            )
                        }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
