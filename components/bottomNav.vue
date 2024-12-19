<script setup lang="ts">
import type { COMPONENT_STATE } from "~/types/components";
import { SubComponentStateKeys } from "../types/components";
import changeComponentState from "../helper/componentsState";
const darkTheme = useState("darkTheme");
const size = { h: "24px", w: "24px" };

const filterFavs: Ref<boolean> = useState("filterFavs");
const subComponentsState: Ref<COMPONENT_STATE> = useState(
    "sub_component_state",
);

const clickHandle = (component: string) => {
    subComponentsState.value = changeComponentState(component, true);
};
</script>

<template>
    <div
        class="flex justify-center items-center w-[95%] py-4 rounded-md lg:shadow-lg lg:rounded-lg bg-bta-secondary-light/80 dark:bg-bta-secondary-dark/80 backdrop-blur-sm shadow-md dark:shadow-none"
    >
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    subComponentsState[SubComponentStateKeys.LOCATION]
                        ? 'bg-bta-elevated-light dark:bg-bta-elevated-dark'
                        : ''
                "
                @click="
                    () => {
                        clickHandle(SubComponentStateKeys.LOCATION);
                    }
                "
            >
                <IconsLocation
                    :size="size"
                    :class="
                        subComponentsState[SubComponentStateKeys.LOCATION]
                            ? 'fill-bta-dark dark:fill-bta-dark'
                            : 'fill-bta-light dark:fill-bta-dark'
                    "
                />
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    subComponentsState[SubComponentStateKeys.FAVS]
                        ? 'bg-bta-elevated-light dark:bg-bta-elevated-dark'
                        : ''
                "
                @click="
                    () => {
                        clickHandle(SubComponentStateKeys.FAVS);
                    }
                "
            >
                <IconsFavs
                    :size="size"
                    :active="subComponentsState[SubComponentStateKeys.FAVS]"
                    :class="
                        subComponentsState[SubComponentStateKeys.FAVS]
                            ? 'fill-bta-dark dark:fill-bta-dark'
                            : 'fill-bta-light dark:fill-bta-dark'
                    "
                />
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    subComponentsState[SubComponentStateKeys.ROUTE]
                        ? 'bg-bta-elevated-light dark:bg-bta-elevated-dark'
                        : ''
                "
                @click="
                    () => {
                        clickHandle(SubComponentStateKeys.ROUTE);
                    }
                "
            >
                <IconsSearch
                    :size="size"
                    :class="
                        subComponentsState[SubComponentStateKeys.ROUTE]
                            ? 'fill-bta-dark dark:fill-bta-dark'
                            : 'fill-bta-light dark:fill-bta-dark'
                    "
                />
            </button>
        </div>
    </div>
</template>
