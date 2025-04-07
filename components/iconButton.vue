<script setup lang="ts">
import type { ConcreteComponent } from "vue";
const props = defineProps<{
    icon: ConcreteComponent;
    iconClass: string;
    bgClass?: string;
    handleClick: () => void;
    size: { w: string; h: string };
}>();

const btnClass = props.bgClass ? props.bgClass : "bg-bta-300 dark:bg-bta-700";
</script>

<template>
    <button
        :class="btnClass"
        class="rounded-full p-2"
        @click="handleClick"
        @touchstart="
            (e: TouchEvent) => {
                (e.target as HTMLElement).classList.add('scale-150');
            }
        "
        @touchend="
            (e: TouchEvent) => {
                (e.target as HTMLElement).classList.remove('scale-150');
            }
        "
    >
        <component :is="icon" :class="iconClass" :size="size"></component>
    </button>
</template>
