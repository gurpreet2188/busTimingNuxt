<script setup lang="ts">
import type { ServiceWithStops } from "~/types/services";
import { GoogleMap, Polyline } from "vue3-google-map";

const route = useRouter().currentRoute.value;
const showNav: Ref<boolean> = useState("showNav");
const expandedNavComponent: Ref<string | null> = useState(
    "expandedNavComponent",
);
const expandedNavProps: Ref<{}> = useState("expandedNavProps");
const title: Ref<string> = useState("title");
const services: Ref<ServiceWithStops[] | null> = ref(null);
const fromToStopName: Ref<string> = ref("");
const hideSwitchBtn: Ref<boolean> = ref(true);
const totalStops: Ref<number> = ref(0);
const totalDistance: Ref<number> = ref(0);
const key = useRuntimeConfig();
const googleMapRoutePath: Ref<{} | null> = useState("routePath", () => null);
const errorMsg: Ref<string | null> = ref(null);
const bottomNavRoute: Ref<string> = useState("bottomNavRoute");
definePageMeta({
    scrollToTop: true,
});
onBeforeMount(async () => {
    bottomNavRoute.value = SEARCH;
    title.value = "Service Info";
    showNav.value = true;
    if (!route.params.service) {
        return;
    }
    expandedNavComponent.value = resolveComponent(
        "LazyExpandedServiceInfo",
    ) as string;
    expandedNavProps.value = {
        serviceCode: route.params.service,
        handleShowBusRoute: handleShowBusRoute,
    };
    const res: { data: ServiceWithStops[] | null; error: any } = await $fetch(
        "/api/get-route",
        {
            body: { service: route.params.service, direction: 1 },
            method: "POST",
        },
    );
    if (res.error) {
        errorMsg.value = res.error;
        return;
    }
    services.value = res.data;
    const routeCoordinates = services.value?.flatMap((v) => [
        { lat: v.lattitude, lng: v.longitude },
    ]);
    googleMapRoutePath.value = {
        path: routeCoordinates,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
    };
});

const handleShowBusRoute = () => {
    navigateTo(SEARCH);
    title.value = "Search";
};

const handleSwitchDirection = async () => {
    const res: { data: ServiceWithStops[]; error: any | null } = await $fetch(
        "/api/get-route",
        {
            body: {
                service: route.params.service,
                direction: services.value![0].direction === 1 ? 2 : 1,
            },
            method: "POST",
        },
    );

    if (res.error) {
        errorMsg.value = res.error;
        return;
    }
    services.value = res.data;
};

watch(services, () => {
    if (!services.value) {
        return;
    }

    if (
        services.value![0].code ===
        services.value![services.value!.length - 1].code
    ) {
        fromToStopName.value = `Loop: ${services.value![0].description}`;
    } else {
        fromToStopName.value = `From: ${services.value![0].description} \nTo: ${services.value![services.value!.length - 1].description}`;
    }
    hideSwitchBtn.value = !services.value![0].second_direction;
    totalStops.value = services.value!.length ? services.value!.length : 0;
    totalDistance.value = services.value![services.value!.length - 1].distance;
});

onBeforeUnmount(async () => {
    expandedNavComponent.value = null;
    expandedNavProps.value = {};
    googleMapRoutePath.value = null;
});
</script>

<template>
    <div
        v-if="services"
        class="relative flex flex-col justify-center items-start mt-32 pb-24 gap-4 w-full"
    >
        <GoogleMap
            style="width: 100%; height: 20rem"
            :api-key="key.public?.GMAP_KEY as string"
            :center="{
                lat: services![0].lattitude!,
                lng: services![0].longitude!,
            }"
            :zoom="12"
        >
            <Polyline :options="googleMapRoutePath!" />
        </GoogleMap>
        <div class="flex flex-col justify-center items-start gap-4 w-full">
            <div class="flex flex-col justify-center items-start w-full">
                <div class="flex flex-row justify-between items-center w-full">
                    <p
                        class="text-lg whitespace-pre line-clamp-2 text-ellipsis text-bta-light dark:text-bta-dark"
                    >
                        {{ fromToStopName }}
                    </p>
                    <button
                        v-if="!hideSwitchBtn"
                        @click="handleSwitchDirection"
                        class="rounded-full p-2 bg-bta-elevated-light/10 dark:bg-bta-elevated-dark10"
                    >
                        <IconsSwitch
                            :size="{ w: '24px', h: '24px' }"
                            class="fill-bta-light dark:fill-bta-dark"
                        />
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

            <div
                class="flex flex-col justify-center items-start text-bta-light dark:text-bta-dark w-full"
            >
                <div
                    class="flex flex-row justify-start gap-4 w-full"
                    v-for="(stop, index) in services!"
                >
                    <div
                        :style="{
                            borderRadius:
                                index === 0
                                    ? '4rem 4rem 0 0'
                                    : index === services!.length - 1
                                      ? '0 0 4rem 4rem'
                                      : '0',
                        }"
                        class="relative w-[5%] md:w-[1.8rem] bg-bta-secondary-light/50 dark:bg-bta-secondary-dark/50"
                    >
                        <span
                            class="absolute rounded-full w-full h-[1.2rem] md:w-[1.5rem] md:h-[1.5rem] top-[0.95rem] bottom-auto md:left-[7%] right-auto bg-bta-loading-bar-light/40 dark:bg-bta-secondary-dark"
                        ></span>

                        <p
                            class="absolute w-full top-[4.9rem] md:top-[4.7rem] bottom-auto left-auto right-auto -rotate-90 leading-none"
                        >
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
    <div v-else>
        <Error :msg="errorMsg!" />
    </div>
</template>

<style scoped>
.hide-service-name {
    opacity: 0;
}
</style>
