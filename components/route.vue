<script setup lang="ts">
import type { RouteWithStops } from "../types/routes";
import { GoogleMap, Polyline } from "vue3-google-map";

const props = defineProps<{ serviceCode: string }>();

const expandedNavComponent: Ref<string | null> = useState("expandedNavComponent")
const expandedNavProps: Ref<{}> = useState("expandedNavProps")
const hideSearch: Ref<boolean> = useState("hideSearch");
const title: Ref<string> = useState("title");
const route: Ref<RouteWithStops[] | null> = ref(null);
const fromToStopName: Ref<string> = ref("");
const hideSwitchBtn: Ref<boolean> = ref(true);
const totalStops: Ref<number> = ref(0);
const totalDistance: Ref<number> = ref(0);
const routePath:Ref<{} | null> = useState("routePath", ()=> null)
const key = useRuntimeConfig()
onMounted(async () => {
    expandedNavComponent.value = resolveComponent("LazyExpandedServiceInfo") as string
    expandedNavProps.value = { serviceCode: props.serviceCode, handleShowBusRoute: handleShowBusRoute }
    route.value = await $fetch("/api/get-route", {
        body: { service: props.serviceCode, direction: 1 },
        method: "POST",
    });

    const routeCoordinates = route.value?.flatMap(v => [{ lat: v.lattitude, lng: v.longitude }])

   routePath.value = {
        path: routeCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
    }
});
const handleShowBusRoute = () => {
    hideSearch.value = false;
    title.value = "Search";
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

onBeforeUnmount(() => {
    expandedNavComponent.value = null
    expandedNavProps.value = {}
    routePath.value= null
});
</script>

<template>
    <div class="relative flex flex-col justify-center items-start gap-4 w-full">
        <GoogleMap v-if="route" style="width: 100%; height: 20rem;" 
        :api-key="key.public?.GMAP_KEY as string" 
        :center="{lat:route![0].lattitude!,lng:route![0].longitude!}"
        :zoom="12">
            <Polyline :options="routePath!"/>
        </GoogleMap>
        <div class="flex flex-col justify-center items-start gap-4 w-full">
            <div class="flex flex-col justify-center items-start w-full">
                <div class="flex flex-row justify-between items-center w-full">
                    <p class="text-lg whitespace-pre line-clamp-2 text-ellipsis text-bta-light dark:text-bta-dark">
                        {{ fromToStopName }}
                    </p>
                    <button v-if="!hideSwitchBtn" @click="handleSwitchDirection" class="rounded-full p-2 bg-bta-elevated-light/10 dark:bg-bta-elevated-dark10">
                        <IconsSwitch :size="{ w: '24px', h: '24px' }" class="fill-bta-light dark:fill-bta-dark" />
                    </button>
                </div>
                <p class="text-bta-light dark:text-bta-dark text-lg">
                    {{
                        totalStops +
                        " Stops / " +
                        totalDistance +
                        "km Total Distance"
                    }}
                </p>
            </div>

            <div class="flex flex-col justify-center items-start text-bta-light dark:text-bta-dark w-full">
                <div class="flex flex-row justify-start gap-4 w-full" v-for="(stop, index) in route!">
                    <div :style="{
                        borderRadius:
                            index === 0
                                ? '4rem 4rem 0 0'
                                : index === route!.length - 1
                                    ? '0 0 4rem 4rem'
                                    : '0',
                    }" class="relative w-[5%] bg-bta-secondary-light/50 dark:bg-bta-secondary-dark/50">
                        <span
                            class="absolute rounded-full w-full h-[1.2rem] md:w-[1.5rem] md:h-[1.5rem] top-[1.1rem] bottom-auto md:left-[0.35rem] right-auto bg-bta-loading-bar-light/40 dark:bg-bta-secondary-dark"></span>

                        <p
                            class="absolute w-full top-[4.9rem] md:top-[4.7rem] bottom-auto left-auto right-auto -rotate-90 leading-none">
                            {{ stop.distance + "km" }}
                        </p>
                    </div>
                    <div class="flex flex-col py-2 w-[95%]">
                        <h2 class="text-2xl">
                            {{ stop.description }}
                        </h2>
                        <p class="text-lg line-clamp-1 text-ellipsis">
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
