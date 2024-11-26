<script setup lang="ts">
import type { ResturcturedRoutes } from "~/types/routes";
import Route from "./route.vue";
const props = defineProps<{}>();

const searchText: Ref<string> = useState("searchText", () => "");
const searchResult: Ref<ResturcturedRoutes[]> = useState(
    "searchResult",
    () => [],
);
const showBusRoute: Ref<boolean> = useState("showBusRoute", () => false);
const routeInfo: Ref<ResturcturedRoutes | undefined> = useState(
    "searchResult",
    () => undefined,
);
const handleOnSubmit = async () => {
    if (searchText.value.length > 0) {
        searchResult.value = await useBusRoute(searchText.value);
        searchResult.value = searchResult.value.sort(
            (a, b) => parseInt(a.ServiceNo) - parseInt(b.ServiceNo),
        );
    }
};

const handleShowRoute = (route: ResturcturedRoutes) => {
    routeInfo.value = route;
    showBusRoute.value = true;
};

watch(showBusRoute, () => {
    if (!showBusRoute.value) {
        handleOnSubmit();
    }
});
</script>

<template>
    <div class="flex flex-col justify-center gap-8 items-center w-full">
        <div
            v-if="!showBusRoute"
            class="flex flex-col justify-center gap-8 items-center w-full"
        >
            <form
                class="flex flex-col justify-start items-start gap-2 w-full"
                @submit.prevent="handleOnSubmit"
            >
                <label
                    for="route"
                    class="text-black dark:text-white text-xl font-"
                    >Search Routes</label
                >
                <div
                    class="flex flex-row justify-start items-center gap-2 w-full"
                >
                    <input
                        class="text-black dark:text-white p-2 rounded-md bg-[#ffe5d9] dark:bg-[#1b263b]"
                        name="route"
                        placeholder="Enter Bus Number"
                        v-model="searchText"
                    />
                    <button
                        class="text-black dark:text-white self-end p-2 rounded-md dark:bg-[#1b263b]"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
            </form>

            <div class="flex flex-col justify-items items-start gap-2 w-full">
                <h2 class="text-black dark:text-white text-lg">
                    Found {{ searchResult.length }} Bus Service(s)
                </h2>
                <div class="flex flex-row flex-wrap gap-2 w-full">
                    <button
                        class="text-black dark:text-white p-2 rounded-md bg-[#ffe5d9] dark:bg-[#1b263b]"
                        v-for="result in searchResult"
                        @click="() => handleShowRoute(result)"
                    >
                        {{ result.ServiceNo }}
                    </button>
                </div>
            </div>
        </div>
        <div
            v-if="showBusRoute"
            class="flex flex-col justify-center gap-8 items-center w-full"
        >
            <Route :title="routeInfo?.ServiceNo!!" :route="routeInfo!!" />
        </div>
    </div>
</template>
