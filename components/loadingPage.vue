<script setup lang="ts">
defineProps<{
    darkTheme: boolean;
    onlyBar: boolean;
    location: boolean;
    error?: boolean;
    msg?: string;
}>();
</script>

<template>
    <div
        class="flex flex-col justify-center items-center h-screen w-full md:w-[60%]"
    >
        <div v-if="!onlyBar" class="relative h-[48px] w-[48px]">
            <div class="absolute">
                <IconsBusStop
                    v-if="location && !error"
                    :color="darkTheme ? '#508991' : '#5f7470'"
                    :size="{ w: '48px', h: '48px' }"
                />
                <IconsLocation
                    v-if="!location && !error"
                    :active="true"
                    :size="{ w: '48px', h: '48px' }"
                />
                <IconsError
                    v-if="error"
                    :color="darkTheme ? '#508991' : '#5f7470'"
                    :size="{ w: '48px', h: '48px' }"
                />
            </div>
        </div>
        <div
            class="relative flex flex-col w-[90%] h-[2px] bg-[#5f7470]/50 dark:bg-[#508991]/50"
        >
            <span
                class="absolute w-[90%] h-[2px] bg-[#5f7470] dark:bg-[#508991] loading-bar"
                :style="{ display: error ? 'none' : 'inline-block' }"
            ></span>
        </div>
        <p
            v-if="!error && !onlyBar"
            class="text-center tracking-wider font-light text-[#5f7470] dark:text-[#508991]"
        >
            {{ msg }}
        </p>

        <p
            v-if="error && !onlyBar"
            class="text-center tracking-wider text-[#5f7470] dark:text-[#508991]"
        >
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
