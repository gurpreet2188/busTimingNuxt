<script setup lang="ts">
import { PropType } from 'nuxt/dist/app/compat/capi';

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
            stroke-width="2px"
            d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
</svg></template>
