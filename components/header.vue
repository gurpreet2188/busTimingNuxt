<script setup lang="ts">
import type { ConcreteComponent } from "vue";
defineProps<{ title: string }>();
const settings = useState("settings");
const refreshData = useState("refreshData");
const animateRefresh: Ref<boolean> = useState("animateRefresh");
const expandedNavComponent: Ref<string | null> = useState("expandedNavComponent", () => null)
const expandedNavProps: Ref<{}> = useState("expandedNavProps", () => { return {} })
const svgIconClass =
    "fill-bta-on-secondary-light dark:fill-bta-dark transition-all duration-300 ease-linear";

const iconRefresh = resolveComponent("IconsRefresh");
const iconCog = resolveComponent("IconsCog");

const addShadow: Ref<string> = ref('')

onMounted(() => {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10 && addShadow.value.length === 0) {
            addShadow.value = 'shadow-md'   
        } else if (addShadow.value.length > 0 && window.scrollY === 0) {
            addShadow.value = ''
        }
    })
})
</script>

<template>
    <div
        :class="addShadow"
        class="fixed flex flex-col justify-between items-center gap-4 p-4 w-full bottom-auto z-10 lg:w-[40%] md:w-[60%] bg-bta-light dark:bg-bta-dark">
        <div class="flex flex-row justify-between items-center w-full">
            <h1 class="text-lg font-bold self-start text-bta-on-secondary-light dark:text-bta-on-secondary-dark mt-1">
                {{ title }}
            </h1>

            <div class="flex flex-row justify-center items-center gap-4">
                <IconButton :class="animateRefresh ? 'animate-spin' : ''" :icon="iconRefresh as ConcreteComponent"
                    :size="{ w: '24px', h: '24px' }" :customClass="svgIconClass"
                    :handle-click="() => (refreshData = !refreshData)" />
                <IconButton :icon="iconCog as ConcreteComponent" :size="{ w: '24px', h: '24px' }"
                    :customClass="svgIconClass" :handle-click="() => (settings = !settings)" />
            </div>
        </div>
        <Transition>
            <component :is="expandedNavComponent!" v-bind="expandedNavProps" />
        </Transition>
    </div>
</template>
