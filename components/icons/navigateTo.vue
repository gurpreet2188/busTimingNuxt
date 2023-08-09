<script setup lang="ts">
import type { PropType } from 'vue';

type SIZE = {
    w:string
    h:string
}

defineProps({color:String, active:Boolean, size:Object as PropType<SIZE> })

</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :width="size?.w" :height="size?.h">
        <path
            :fill="color"
            :fill-opacity="1"
           
            d="M17.27 6.73L13.03 16.86L11.71 13.44L11.39 12.61L10.57 12.29L7.14 10.96L17.27 6.73M21 3L3 10.53V11.5L9.84 14.16L12.5 21H13.46L21 3Z" />
    </svg>
</template>