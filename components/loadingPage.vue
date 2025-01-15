<script setup lang="ts">
const props = defineProps<{
    showBarOnly: boolean;
    location: boolean;
    error?: boolean;
    msg?: string;
}>();
</script>

<template>
    <div
        class="flex flex-col justify-center items-center gap-4 h-screen w-full md:w-[60%] text-bta-light dark:text-bta-dark"
    >
        <div v-if="!showBarOnly" class="relative h-[48px] w-[48px]">
            <div class="absolute">
                <IconsBusStop
                    v-if="location && !error"
                    :size="{ w: '48px', h: '48px' }"
                />
                <IconsLocation
                    v-if="!location && !error"
                    :active="true"
                    :size="{ w: '48px', h: '48px' }"
                />
                <IconsError v-if="error" :size="{ w: '48px', h: '48px' }" />
            </div>
        </div>
        <div
            class="relative flex flex-col w-[90%] h-[2px] bg-bta-loading-bar-light/50 dark:bg-bta-loading-bar-dark/50 overflow-hidden"
        >
            <span
                class="absolute w-[90%] h-[2px] bg-bta-loading-bar-light dark:bg-bta-loading-bar-dark loading-bar"
                :style="{ display: error ? 'none' : 'inline-block' }"
            ></span>
        </div>
        <p
            v-if="!error && !showBarOnly"
            class="text-center tracking-wider font-light"
        >
            {{ msg }}
        </p>

        <p v-if="error && !showBarOnly" class="text-center tracking-wider">
            {{ msg }}
        </p>
    </div>
</template>

<style>
.loading-bar {
    animation: loadingAnimation 2s linear infinite;
}

@keyframes loadingAnimation {
    0%,
    100% {
        transform: translateX(-100%);
    }

    50% {
        transform: translateX(100%);
    }
}
</style>
