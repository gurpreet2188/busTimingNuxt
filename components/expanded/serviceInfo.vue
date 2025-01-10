<script lang="ts" setup>
    defineProps<{serviceCode:string, handleShowBusRoute:()=>void}>()
</script>

<template>
    <div
            ref="serviceNameRef"
            class="flex flex-row justify-between items-center w-full transition-opacity duration-500 delay-500"
        >
            <h2 class="text-2xl text-bta-light dark:text-bta-dark">
                {{ serviceCode }}
            </h2>
            <button @click="handleShowBusRoute" class="p-2 rounded-full bg-bta-elevated-light/10 dark:bg-bta-elevated-dark/10">
                <IconsClose
                    class="fill-bta-light dark:fill-bta-dark"
                    :size="{ w: '24px', h: '24px' }"
                />
            </button>
        </div>
</template>