<script setup lang="ts">
import type { ConcreteComponent } from "vue";
defineProps<{ title: string }>();
const settings = useState("settings");
const refreshData = useState("refreshData");
const expandNav = useState("expandNav", () => false);
const expandedNavData = useState("expandedNavData", () => "");
const hideSearch: Ref<boolean> = useState("hideSearch");
const animateRefresh: Ref<boolean> = useState("animateRefresh");
const handleCloseBtn = () => (hideSearch.value = false);

const svgIconClass =
    "fill-bta-on-secondary-light dark:fill-bta-dark transition-all duration-300 ease-linear";

const iconRefresh = resolveComponent("IconsRefresh");
const iconCog = resolveComponent("IconsCog");
</script>

<template>
    <div
        class="fixed flex flex-col justify-between items-center rounded-md shadow-md p-4 w-[95%] top-2 bottom-auto z-10 bg-bta-secondary-light/80 dark:bg-bta-secondary-dark/80 backdrop-blur-md lg:w-[40%] md:w-[60%]"
    >
        <div class="flex flex-row justify-between items-center w-full">
            <h1
                class="text-3xl self-start font-light text-bta-on-secondary-light dark:text-bta-on-secondary-dark"
            >
                {{ title }}
            </h1>

            <div class="flex flex-row justify-center items-center gap-4">
                <IconButton
                    :class="animateRefresh ? 'animate-spin' : ''"
                    :icon="iconRefresh as ConcreteComponent"
                    :size="{ w: '28px', h: '28px' }"
                    :customClass="svgIconClass"
                    :handle-click="() => (refreshData = !refreshData)"
                />
                <IconButton
                    :icon="iconCog as ConcreteComponent"
                    :size="{ w: '28px', h: '28px' }"
                    :customClass="svgIconClass"
                    :handle-click="() => (settings = !settings)"
                />
            </div>
        </div>
        <Transition>
            <div
                v-if="expandNav"
                class="flex flex-row justify-between items-center pt-10 rounded-md w-full"
            >
                <h2
                    class="text-4xl font-light line-clamp-1 text-ellipsis leading-normal text-bta-light dark:text-bta-dark"
                >
                    {{ expandedNavData }}
                </h2>
                <button @click="handleCloseBtn">
                    <IconsClose
                        class="fill-bta-on-secondary-light dark:fill-bta-dark"
                        :size="{ w: '32px', h: '32px' }"
                    />
                </button>
            </div>
        </Transition>
    </div>
</template>
