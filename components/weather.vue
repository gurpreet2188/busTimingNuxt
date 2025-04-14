<script lang="ts" setup>
import type { ConcreteComponent } from "vue";

const props = defineProps<{ weatherConditon: string | undefined }>();
const computedIcon: ConcreteComponent = computed(() => {
    if (props.weatherConditon!.toLowerCase().includes("fair")) {
        if (props.weatherConditon!.toLowerCase().includes("day")) {
            return resolveComponent("IconsClearDay");
        } else {
            return resolveComponent("IconsClearNight");
        }
    } else if (props.weatherConditon!.toLowerCase().includes("cloudy")) {
        if (props.weatherConditon!.toLowerCase().includes("day")) {
            return resolveComponent("IconsCloudyDay");
        } else {
            return resolveComponent("IconsCloudyNight");
        }
    } else if (
        props.weatherConditon!.toLowerCase().includes("rain") ||
        props.weatherConditon!.toLowerCase().includes("showers")
    ) {
        return resolveComponent("IconsRain");
    } else {
        return resolveComponent("IconsFog");
    }
});
const iconProps = {
    size: { w: "18px", h: "18px" },
};
</script>
<template>
    <div class="flex flex-row justify-center items-center p-2 gap-2 w-full">
        <p class="text-bta-950 dark:text-bta-100 font-light text-xs/2">
            {{ weatherConditon?.split("(")[0] }}
        </p>
        <component
            :is="computedIcon"
            class="fill-bta-800 dark:fill-bta-100"
            v-bind="{ size: { w: '20px', h: '20px' } }"
        />
    </div>
</template>
