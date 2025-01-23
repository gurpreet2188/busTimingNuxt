<script setup lang="ts">
import type {Stop} from "~/types/stops";
import {pipeline} from "@huggingface/transformers";

const title: Ref<string> = useState("title");
const router = useRouter();
const showNav: Ref<boolean> = useState("showNav");
const bottomNavRoute: Ref<string> = useState("bottomNavRoute");
const searchDIV: Ref<HTMLElement | null> = ref(null);
const showLoading: Ref<boolean> = ref(false);
const searchText: Ref<{ text: string }> = useState("searchText", () => {
  return {text: ""};
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
const errorMsg: Ref<string> = ref("")
onMounted(async () => {
  showNav.value = true;
  bottomNavRoute.value = SEARCH;
  title.value = "Search";
});

const handleOnSubmit = async () => {
  errorMsg.value = "";
  if (searchText.value?.text.length === 0) {
    errorMsg.value = "Input text in search bar..."
    return;
  }
  showLoading.value = true;

  const result: { services: { service: string }[], stops: Stop[], servicesError: any, stopsError: any } =
      await $fetch("/api/search-db", {
        body: searchText.value,
        method: "POST",
      });

  if (result.servicesError || result.stopsError) {
    errorMsg.value = result.stopsError + " " + result.servicesError;
    showLoading.value = false;
    return
  }
  routesResults.value = result?.services!;
  stopsResults.value = result.stops ? result.stops : [];


  if (stopsResults.value.length === 0) {
    const pipe = await pipeline("embeddings", "TaylorAI/gte-tiny", {
      dtype: "fp32",
    });
    const t = await pipe(searchText.value?.text!, {
      pooling: "mean",
      normalize: true,
    });
    const res: { data: Stop[] | null, error: any | null } = await $fetch(
        "/api/search-db-embeddings",
        {
          method: "POST",
          body: {
            embedding: Array.from(t.ort_tensor.data as Float32Array),
          },
        },
    );

    if (res.error) {
      errorMsg.value = res.error;
      return
    }
    stopsResults.value = res.data!;
  }

  // console.log(res?.stops);
  if (
      result?.services.length === 0 &&
      result?.stops.length === 0 &&
      stopsResults.value!.length === 0
  ) {
    searchResultMsg.value = "No Results";
  }
  showLoading.value = false;
};

const handleServiceClick = async (service: string) => {
  await navigateTo({
    path: SERVICE + "/" + service,
  });
  title.value = "Bus Route";
};

const handleStopClick = async (stop: Stop) => {
  await navigateTo({
    path: STOP + "/" + stop.code,
  });
  title.value = "Stop Info";
};

watch(hideSearch, () => {
  if (!hideSearch.value) {
    serviceCode.value = null;
    stopInfo.value = null;
  }
});
</script>

<template>
  <div
      ref="searchDIV"
      class="flex flex-col justify-center gap-8 mt-20 items-center w-full pb-32 pt-5"
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

        <Error v-if="errorMsg.length > 0" :msg="errorMsg"/>

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
                class="flex flex-col justify-center items-start p-4 text-bta-light dark:text-bta-dark rounded-md bg-bta-elevated-light/5 w-full"
                v-for="res in stopsResults"
                @click="() => handleStopClick(res)"
            >
              <p class="text-xl">
                {{ res.code }}
              </p>
              <p class="text-xl line-clamp-1 text-left">
                {{ res.description }}
              </p>
              <p class="text-xl line-clamp-1 text-left">
                {{ res.street }}
              </p>
              <p class="text-sm mt-4">Services:</p>
              <div
                  class="flex flex-row flex-wrap gap-2 w-full text-bta-light/90 dark:text-bta-dark/90"
              >
                <p v-for="service in res.services">
                  {{ service }}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
