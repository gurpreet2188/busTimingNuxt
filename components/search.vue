<script setup lang="ts">
import type { Stop } from "~/types/stops";
import Route from "./route.vue";

const title: Ref<string> = useState("title");
const searchDIV: Ref<HTMLElement | null> = ref(null);
const lastScroll: Ref<number> = useState("searchLastScroll", () => 0);
const searchText: Ref<{ text: string }> = useState("searchText", () => {
    return { text: "" };
});

const searchResultMsg: Ref<string> = useState("searchResultMsg", () => "");
const routesResults: Ref<{ service: string }[]> = useState(
    "routesResults",
    () => [],
);
const stopsResults: Ref<Stop[]> = useState("stopsResults", () => []);
const hideSearch: Ref<boolean> = useState("hideSearch", () => false);

const serviceCode: Ref<string | null> = useState("serviceCode", () => null);
const stopInfo: Ref<Stop | null> = useState("stopCode", () => null);

onMounted(() => {
    window.addEventListener("scroll", () => {
        if (!hideSearch.value) {
            lastScroll.value = window.scrollY;
        }
    });
    title.value = "Search";
});

const handleOnSubmit = async () => {
    const result = await $fetch("/api/search-db", {
        body: searchText.value,
        method: "POST",
    });
    routesResults.value = result?.services!;
    stopsResults.value = result?.stops!;
    if (result?.services.length === 0 && result?.stops.length === 0) {
        searchResultMsg.value = "No Results";
    }
};

const handleServiceClick = (service: string) => {
    serviceCode.value = service;
    title.value = "Bus Route";
    hideSearch.value = true;
};

const handleStopClick = (stop: Stop) => {
    stopInfo.value = stop;
    title.value = "Stop Info";
    hideSearch.value = true;
};

watch(hideSearch, () => {
    if (!hideSearch.value) {
        handleOnSubmit();
        console.log(lastScroll.value);
        window.scrollBy({ top: lastScroll.value });
        serviceCode.value = null;
        stopInfo.value = null;
    }
});
</script>

<template>
    <div
        ref="searchDIV"
        class="flex flex-col justify-center gap-8 items-center w-full pb-32 pt-5"
    >
        <div class="flex flex-col justify-center gap-8 items-center w-full">
            <SearchInputBar
                v-if="!hideSearch"
                :title="'Search for Routes for BusStops'"
                :handle-on-submit="() => handleOnSubmit()"
                v-model="searchText"
            />

            <div
                v-if="!hideSearch"
                class="flex flex-col justify-items items-start gap-8 w-full"
            >
                <p class="text-black dark:text-white">
                    {{ searchResultMsg }}
                </p>
                <div class="flex flex-col gap-2 w-full">
                    <h3
                        v-if="routesResults.length > 0"
                        class="text-lg text-bta-light dark:text-bta-dark"
                    >
                        Bus Services
                    </h3>
                    <div
                        class="flex flex-row lg:flex-wrap gap-4 py-2 overflow-x-scroll lg:overflow-auto"
                    >
                        <button
                            class="text-xl p-2 text-bta-light dark:text-bta-dark rounded-md bg-bta-elevated-light/10 dark:bg-bta-elevated-dark/10"
                            v-for="res in routesResults"
                            @click="() => handleServiceClick(res.service)"
                        >
                            {{ res.service }}
                        </button>
                    </div>
                </div>
                <div class="flex flex-col gap-2 w-full">
                    <h3
                        v-if="stopsResults.length > 0"
                        class="text-lg text-bta-light dark:text-bta-dark"
                    >
                        Bus Stops
                    </h3>
                    <div class="flex flex-row flex-wrap gap-4 w-full">
                        <button
                            class="flex flex-col justify-center items-start p-4 text-bta-light dark:text-bta-dark rounded-md bg-bta-elevated-light/10 dark:bg-bta-elevated-dark/10 w-full"
                            v-for="res in stopsResults"
                            @click="() => handleStopClick(res)"
                        >
                            <h2 class="text-lg">
                                {{ res.code }}
                            </h2>
                            <p class="text-2xl">
                                {{ res.description }}
                            </p>
                            <p class="text-lg">{{ res.street }}</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="hideSearch && serviceCode"
            class="flex flex-col justify-center gap-8 items-center w-full"
        >
            <Route :serviceCode="serviceCode" />
        </div>
        <div
            v-if="hideSearch && stopInfo"
            class="flex flex-col justify-center gap-8 items-center w-full"
        >
            <StopInfoWithServices :stopInfo="stopInfo" />
        </div>
    </div>
</template>