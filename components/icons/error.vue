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
            d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
</svg></template>