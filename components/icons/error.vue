<script setup lang="ts">
import type { PropType } from "vue";

type SIZE = {
    w: string;
    h: string;
};

const props = defineProps<{
    size: SIZE;
}>();
const color =
    "fill-bta-light stroke-bta-light dark:fill-bta-dark dark:stroke-bta-dark";
</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        :width="size?.w"
        :height="size?.h"
    >
        <path
            :class="color"
            :fill-opacity="1"
            d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
        />
    </svg>
</template>
