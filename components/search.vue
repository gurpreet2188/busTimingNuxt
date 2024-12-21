<script setup lang="ts">
import type { RestructuredRoutes } from "~/types/routes";
import type { RestructuredStops } from "~/types/stops";
import Route from "./route.vue";

const title: Ref<string> = useState("title");

onMounted(() => (title.value = "Search"));

const searchText: Ref<{ text: string }> = useState("searchText", () => {
    return { text: "" };
});

const searchResultMsg: Ref<string> = useState("searchResultMsg", () => "");
const searchResult: Ref<RestructuredRoutes[] | RestructuredStops[]> = useState(
    "searchResult",
    () => [],
);
const hideSearch: Ref<boolean> = useState("hideSearch", () => false);
const routeInfo: Ref<RestructuredRoutes | undefined> = useState(
    "routeInfo",
    () => undefined,
);
const stopInfo: Ref<RestructuredStops | undefined> = useState(
    "stopInfo",
    () => undefined,
);

const handleOnSubmit = async () => {
    if (searchText.value.text.length > 0 && searchText.value.text.length < 5) {
        searchResult.value = (await useBusRoute(
            searchText.value.text,
        )) as RestructuredRoutes[];
        searchResultMsg.value =
            "Found " + searchResult.value.length + " Bus Service(s)";
        searchResult.value = searchResult.value.sort(
            (a, b) => parseInt(a.ServiceNo) - parseInt(b.ServiceNo),
        );
        return;
    } else if (searchText.value.text.length === 5) {
        searchResult.value = await useBusStopCode(searchText.value.text);
        searchResultMsg.value =
            "Found " + searchResult.value.length + " Bus Stop(s)";
        return;
    } else {
        searchResult.value = await useBusStopName(
            searchText.value.text.toLowerCase(),
        );
        searchResultMsg.value =
            "Found " + searchResult.value.length + " Bus Stop(s)";
    }

    searchResultMsg.value = "No Results";
};

const handleClick = (data: RestructuredRoutes | RestructuredStops) => {
    if (Object.keys(data).includes("ServiceNo")) {
        routeInfo.value = data as RestructuredRoutes;
        stopInfo.value = undefined;
        title.value = "Bust Route";
    } else {
        stopInfo.value = data as RestructuredStops;
        routeInfo.value = undefined;
        title.value = "Stop Info";
    }
    hideSearch.value = true;
};

watch(hideSearch, () => {
    if (!hideSearch.value) {
        handleOnSubmit();
    }
});
</script>

<template>
    <div
        class="flex flex-col justify-center gap-8 items-center w-full pb-20 pt-5"
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
                class="flex flex-col justify-items items-start gap-2 w-full"
            >
                <p class="text-black dark:text-white">
                    {{ searchResultMsg }}
                </p>
                <div class="flex flex-row flex-wrap gap-2 w-full">
                    <button
                        class="text-bta-on-secondary-light dark:text-bta-on-secondary-dark p-2 rounded-md shadow-md dark:shadow-none bg-bta-secondary-light dark:bg-bta-secondary-dark w-full"
                        v-for="result in searchResult"
                        @click="() => handleClick(result)"
                    >
                        <div v-if="(result as RestructuredRoutes)['ServiceNo']">
                            <h2 class="text-3xl font-light p-4">
                                {{ (result as RestructuredRoutes).ServiceNo }}
                            </h2>
                        </div>
                        <div
                            v-if="(result as RestructuredStops)['BusStopCode']"
                            class="flex flex-col justify-center items-start gap-2 p-2 w-full text-bta-light dark:text-bta-dark"
                        >
                            <h2 class="text-3xl font-light">
                                {{ (result as RestructuredStops).BusStopCode }}
                            </h2>
                            <p>
                                {{ (result as RestructuredStops).Description }}
                            </p>
                            <p>{{ (result as RestructuredStops).RoadName }}</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <div
            v-if="hideSearch && routeInfo"
            class="flex flex-col justify-center gap-8 items-center w-full"
        >
            <Route
                :serviceNo="routeInfo?.ServiceNo!!"
                :route="routeInfo!! as RestructuredRoutes"
            />
        </div>
        <div
            v-if="hideSearch && stopInfo"
            class="flex flex-col justify-center gap-8 items-center w-full"
        >
            <StopInfoWithServices :stopInfo="stopInfo" />
        </div>
    </div>
</template>
