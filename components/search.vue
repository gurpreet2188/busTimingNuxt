<script setup lang="ts">
import type { Stop } from "~/types/stops";
import Route from "./route.vue";
import { pipeline } from "@huggingface/transformers";
const title: Ref<string> = useState("title");
const searchDIV: Ref<HTMLElement | null> = ref(null);
const lastScroll: Ref<number> = useState("searchLastScroll", () => 0);
const showLoading: Ref<boolean> = ref(false);
const searchText: Ref<{ text: string }> = useState("searchText", () => {
    return { text: "" };
});
const embeddedResults: Ref<Stop[] | null> = useState(
    "embeddedSearchText",
    () => null,
);
const searchResultMsg: Ref<string> = useState("searchResultMsg", () => "");
const routesResults: Ref<{ service: string }[]> = useState(
    "routesResults",
    () => [],
);
const stopsResults: Ref<Stop[]> = useState("stopsResults", () => []);
const hideSearch: Ref<boolean> = useState("hideSearch", () => false);

const serviceCode: Ref<string | null> = useState("serviceCode", () => null);
const stopInfo: Ref<Stop | null> = useState("stopCode", () => null);
const temp = ref(null);
onMounted(async () => {
    window.addEventListener("scroll", () => {
        if (!hideSearch.value) {
            lastScroll.value = window.scrollY;
        }
    });
    title.value = "Search";
});

const handleOnSubmit = async () => {
    showLoading.value = true;
    const result = await $fetch("/api/search-db", {
        body: searchText.value,
        method: "POST",
    });
    routesResults.value = result?.services!;
    stopsResults.value = result?.stops!;

    // if (/[a-zA-Z]/.test(searchText.value?.text!)) {
    embeddedResults.value = null;
    const pipe = await pipeline("embeddings", "TaylorAI/gte-tiny", {
        dtype: "fp32",
    });
    const t = await pipe(searchText.value?.text!, {
        pooling: "mean",
        normalize: true,
    });
    const res: { stops: Stop[] } = await $fetch("/api/search-db-embeddings", {
        method: "POST",
        body: {
            embedding: Array.from(t.ort_tensor.data as Float32Array),
        },
    });
    embeddedResults.value = res?.stops;
    if (
        result?.services.length === 0 &&
        result?.stops.length === 0 &&
        embeddedResults.value.length === 0
    ) {
        searchResultMsg.value = "No Results";
    }
    // }
    showLoading.value = false;
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
                <div
                    :style="{
                        display: showLoading ? 'inline-block' : 'none',
                    }"
                    class="relative self-center justify-self-center flex flex-col w-[50%] h-[2px] bg-bta-loading-bar-light/50 dark:bg-bta-loading-bar-dark/50 overflow-hidden"
                >
                    <span
                        class="absolute w-[50%] h-[2px] bg-bta-loading-bar-light dark:bg-bta-loading-bar-dark loading-bar"
                    ></span>
                </div>
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
                        v-if="
                            stopsResults.length > 0 ||
                            embeddedResults?.length! > 0
                        "
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
                            <h2 class="text-xl">
                                {{ res.code }}
                            </h2>
                            <p class="text-xl line-clamp-1 text-left">
                                {{ res.description }}
                            </p>
                            <p class="text-xl line-clamp-1 text-left">
                                {{ res.street }}
                            </p>
                        </button>
                        <button
                            class="flex flex-col justify-center items-start p-4 text-bta-light dark:text-bta-dark rounded-md bg-bta-elevated-light/10 dark:bg-bta-elevated-dark/10 w-full"
                            v-for="res in embeddedResults"
                            @click="() => handleStopClick(res)"
                        >
                            <h2 class="text-xl">
                                {{ res.code }}
                            </h2>
                            <p class="text-xl line-clamp-1 text-left">
                                {{ res.description }}
                            </p>
                            <p class="text-xl line-clamp-1 text-left">
                                {{ res.street }}
                            </p>
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
