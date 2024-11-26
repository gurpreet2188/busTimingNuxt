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
        class="flex justify-center items-center w-[100%] h-[100%] lg:shadow-lg lg:rounded-lg bg-[#f8edeb]/50 dark:bg-[#0d1b2a]/50 backdrop-blur-md"
    >
        <div class="flex justify-center items-center w-[50%]">
            <button
                @click="
                    () => {
                        clickHandle(SubComponentStateKeys.LOCATION);
                    }
                "
            >
                <IconsLocation
                    :color="darkTheme ? '#ffcdb2' : '#7f5539'"
                    :size="size"
                    :active="subComponentsState[SubComponentStateKeys.LOCATION]"
                />
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button
                @click="
                    () => {
                        clickHandle(SubComponentStateKeys.FAVS);
                    }
                "
            >
                <IconsFavs
                    :color="darkTheme ? '#ffcdb2' : '#7f5539'"
                    :size="size"
                    :active="subComponentsState[SubComponentStateKeys.FAVS]"
                />
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button
                @click="
                    () => {
                        clickHandle(SubComponentStateKeys.ROUTE);
                    }
                "
            >
                <IconsRoute
                    :color="darkTheme ? '#ffcdb2' : '#7f5539'"
                    :size="size"
                    :active="subComponentsState[SubComponentStateKeys.ROUTE]"
                />
            </button>
        </div>
    </div>
</template>
