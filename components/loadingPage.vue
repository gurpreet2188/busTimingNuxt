<script setup lang="ts">
const props = defineProps<{
    darkTheme: boolean;
    location: { lat: number; lon: number } | null;
    error: any;
}>();
</script>

<template>
    <div
        class="flex flex-col justify-center items-center h-screen w-full md:w-[60%]"
    >
        <div class="relative h-[48px] w-[48px]">
            <div class="absolute">
                <IconsBusStop
                    v-if="location && !error?.message"
                    :color="darkTheme ? '#ffcdb2' : '#6d6875'"
                    :size="{ w: '48px', h: '48px' }"
                />
                <IconsLocation
                    v-if="!location && !error?.message"
                    :color="darkTheme ? '#ffcdb2' : '#6d6875'"
                    :size="{ w: '48px', h: '48px' }"
                />
                <IconsError
                    v-if="error?.message"
                    :color="darkTheme ? '#ffcdb2' : '#6d6875'"
                    :size="{ w: '48px', h: '48px' }"
                />
            </div>
        </div>
        <div
            class="relative flex flex-col w-[90%] h-[2px] bg-[#6d6875]/50 dark:bg-[#ffcdb2]/50"
        >
            <span
                class="absolute w-[90%] h-[2px] bg-[#6d6875] dark:bg-[#ffcdb2] loading-bar"
                :style="{ display: error?.message && 'none' }"
            ></span>
        </div>
        <p
            v-if="!error?.message"
            class="text-center tracking-wider font-light text-[#6d6875] dark:text-[#ffcdb2]"
        >
            {{
                location
                    ? "Finding nearest bus stops..."
                    : "Waiting for device Location..."
            }}
        </p>

        <p
            v-if="error?.message"
            class="text-center tracking-wider text-[#6d6875] dark:text-[#ffcdb2]"
        >
            {{ error?.message }}
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
