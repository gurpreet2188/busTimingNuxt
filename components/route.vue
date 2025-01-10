<script setup lang="ts">
import type { COMPONENT_STATE } from "~/types/components";
import { SubComponentStateKeys } from "~/types/components";
import type { RouteWithStops } from "../types/routes";

const props = defineProps<{ serviceCode: string }>();
const hideSearch: Ref<boolean> = useState("hideSearch");
const title: Ref<string> = useState("title");
const expandNav = useState("expandNav", () => false);
const expandedNavData = useState("expandedNavData", () => "");
const subComponentState: Ref<COMPONENT_STATE> = useState("sub_component_state");
const route: Ref<RouteWithStops[] | null> = ref(null);
const fromToStopName: Ref<string> = ref("");
const hideSwitchBtn: Ref<boolean> = ref(true);
const totalStops: Ref<number> = ref(0);
const totalDistance: Ref<number> = ref(0);

onMounted(async () => {
    route.value = await $fetch("/api/get-route", {
        body: { service: props.serviceCode, direction: 1 },
        method: "POST",
    });
});
const handleShowBusRoute = () => {
    hideSearch.value = false;
    title.value = "Search";
    expandNav.value = false;
    expandedNavData.value = "";
};

const handleSwitchDirection = async () => {
    route.value = await $fetch("/api/get-route", {
        body: {
            service: props.serviceCode,
            direction: route.value![0].direction === 1 ? 2 : 1,
        },
        method: "POST",
    });
};

watch(route, () => {
    if (!route.value) {
        return;
    }

    if (route.value![0].code === route.value![route.value!.length - 1].code) {
        fromToStopName.value = `Loop: ${route.value![0].description}`;
    } else {
        fromToStopName.value = `From: ${route.value![0].description} \nTo: ${route.value![route.value!.length - 1].description}`;
    }
    hideSwitchBtn.value = !route.value![0].second_direction;
    totalStops.value = route.value!.length ? route.value!.length : 0;
    totalDistance.value = route.value![route.value!.length - 1].distance;
});
const serviceNameRef: Ref<HTMLElement | null> = ref(null);

const ib = new IntersectionObserver(
    (entries, observer) => {
        for (const e of entries) {
            if (
                !e.isIntersecting &&
                subComponentState.value[SubComponentStateKeys.ROUTE]
            ) {
                (e.target as HTMLElement).classList.add("hide-service-name");
                expandNav.value = true;
                expandedNavData.value = props.serviceCode;
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
    ib.observe(serviceNameRef.value as HTMLElement);
});

onBeforeUnmount(() => {
    ib.unobserve(serviceNameRef.value as HTMLElement);
    expandNav.value = false;
    expandedNavData.value = "";
});
</script>

<template>
    <div class="relative flex flex-col justify-center items-start gap-4 w-full">
        <div
            ref="serviceNameRef"
            class="flex flex-row justify-between items-center w-full transition-opacity duration-500 delay-500"
        >
            <h2 class="text-4xl text-bta-light dark:text-bta-dark">
                {{ serviceCode }}
            </h2>
            <button @click="handleShowBusRoute">
                <IconsClose
                    class="fill-bta-on-secondary-light dark:fill-bta-dark"
                    :size="{ w: '32px', h: '32px' }"
                />
            </button>
        </div>
        <div class="flex flex-col justify-center items-start gap-4 w-full">
            <div class="flex flex-col justify-center items-start gap-2 w-full">
                <div class="flex flex-row justify-between items-center w-full">
                    <p
                        class="py-2 text-xl whitespace-pre line-clamp-2 text-ellipsis text-bta-light dark:text-bta-dark"
                    >
                        {{ fromToStopName }}
                    </p>
                    <button
                        v-if="!hideSwitchBtn"
                        @click="handleSwitchDirection"
                    >
                        <IconsSwitch
                            :size="{ w: '32px', h: '32px' }"
                            class="fill-bta-light dark:fill-bta-dark"
                        />
                    </button>
                </div>
                <p class="text-bta-light dark:text-bta-dark">
                    {{
                        totalStops +
                        " Stops / " +
                        totalDistance +
                        "km Total Distance"
                    }}
                </p>
            </div>

            <div
                class="flex flex-col justify-center items-start text-bta-light dark:text-bta-dark w-full"
            >
                <div
                    class="flex flex-row justify-start gap-4 w-full"
                    v-for="(stop, index) in route!"
                >
                    <div
                        :style="{
                            borderRadius:
                                index === 0
                                    ? '4rem 4rem 0 0'
                                    : index === route!.length - 1
                                      ? '0 0 4rem 4rem'
                                      : '0',
                        }"
                        class="relative w-[5%] bg-bta-secondary-light/50 dark:bg-bta-secondary-dark/50"
                    >
                        <span
                            class="absolute rounded-full w-full h-[1.2rem] md:w-[1.5rem] md:h-[1.5rem] top-[1.1rem] bottom-auto md:left-[0.35rem] right-auto bg-bta-loading-bar-light/40 dark:bg-bta-secondary-dark"
                        ></span>

                        <p
                            class="absolute w-full top-[4.9rem] md:top-[4.7rem] bottom-auto left-auto right-auto -rotate-90 leading-none"
                        >
                            {{ stop.distance + "km" }}
                        </p>
                    </div>
                    <div class="flex flex-col py-2 w-[95%]">
                        <h2 class="text-3xl">
                            {{ stop.description }}
                        </h2>
                        <p class="text-xl line-clamp-1 text-ellipsis">
                            {{ stop.street }}
                        </p>
                        <p>
                            {{ stop.code }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.hide-service-name {
    opacity: 0;
}
</style>
