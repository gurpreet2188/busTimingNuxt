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
    } else if (searchText.value.text.length === 5) {
        searchResult.value = await useBusStopCode(searchText.value.text);
        searchResultMsg.value =
            "Found " + searchResult.value.length + " Bus Stop(s)";
    } else {
        searchResultMsg.value = "No Results";
    }
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

console.log(routeInfo.value, stopInfo.value);
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
                        class="text-bta-on-secondary-light dark:text-bta-on-secondary-dark p-2 rounded-md shadow-md dark:shadow-none bg-bta-secondary-light dark:bg-bta-secondary-dark"
                        v-for="result in searchResult"
                        @click="() => handleClick(result)"
                    >
                        {{
                            // @ts-ignore
                            result["ServiceNo"]!! || result["BusStopCode"]!!
                        }}
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
