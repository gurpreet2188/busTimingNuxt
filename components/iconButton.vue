<script setup lang="ts">
import type { ConcreteComponent } from "vue";
defineProps<{
    icon: ConcreteComponent;
    customClass: string;
    handleClick: () => void;
    size: { w: string; h: string };
}>();
</script>

<template>
    <button
        class="bg-bta-secondary-light/30 dark:bg-bta-elevated-dark/30 rounded-full p-2"
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
        <component :is="icon" :class="customClass" :size="size"></component>
    </button>
</template>
