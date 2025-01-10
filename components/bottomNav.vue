<script setup lang="ts">
import type { COMPONENT_STATE } from "~/types/components";
import { SubComponentStateKeys } from "../types/components";
import changeComponentState from "../helper/componentsState";
const size = { h: "24px", w: "24px" };

const subComponentsState: Ref<COMPONENT_STATE> = useState(
    "sub_component_state",
);

const clickHandle = (component: string) => {
    subComponentsState.value = changeComponentState(component, true);
};
</script>

<template>
    <div
        class="flex justify-center items-center w-full py-4 lg:p-2 rounded-md border-t-[1px] border-bta-light/50 dark:border-bta-dark/50 lg:shadow-lg lg:rounded-lg bg-bta-light dark:bg-bta-dark"
    >
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    subComponentsState[SubComponentStateKeys.LOCATION]
                        ? 'bg-bta-elevated-light/30 dark:bg-bta-elevated-dark/30'
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
                    class="fill-bta-light dark:fill-bta-dark"
                />
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    subComponentsState[SubComponentStateKeys.FAVS]
                        ? 'bg-bta-elevated-light/30 dark:bg-bta-elevated-dark/30'
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
                    class="fill-bta-light dark:fill-bta-dark"
                />
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    subComponentsState[SubComponentStateKeys.ROUTE]
                        ? 'bg-bta-elevated-light/30 dark:bg-bta-elevated-dark/30'
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
                    class="fill-bta-light dark:fill-bta-dark"
                />
            </button>
        </div>
    </div>
</template>
