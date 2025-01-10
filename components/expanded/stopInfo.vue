<script lang="ts" setup>
import type { Stop } from '~/types/stops';

defineProps<{stopInfo:Stop,handleHideSearch:()=>void}>()
</script>

<template>
    <div class="flex flex-col justify-center items-start gap-2 py-2 w-full text-bta-light dark:text-bta-dark ">
            <div ref="stopNameRef" class="flex flex-row justify-between items-center w-full">
                <h2 class="text-lg tracking-wide">
                    {{ stopInfo.code }}
                </h2>
                <button @click="handleHideSearch" class="bg-bta-elevated-light/10 dark:bg-bta-elevated-dark/10 p-2 rounded-full">
                    <IconsClose  class="fill-bta-light dark:fill-bta-dark"
                    :size="{ w: '24px', h: '24px' }" />
                </button>
               
            </div>
            <div class="self-start">
                <p class="text-2xl">{{ stopInfo.description }}</p>
                <p class="text-lg">{{ stopInfo.street }}</p>
            </div>
        </div>
</template>