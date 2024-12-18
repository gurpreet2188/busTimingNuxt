<script setup lang="ts">
defineProps<{ title: string }>();
const settings = useState("settings");
const refreshData = useState("refreshData");
</script>

<template>
    <div
        class="fixed flex flex-row justify-between items-center rounded-md shadow-md p-4 w-[95%] top-2 bottom-auto z-10 bg-bta-secondary-light/80 dark:bg-bta-secondary-dark/80 backdrop-blur-md lg:w-[40%] md:w-[60%]"
    >
        <h1
            class="text-3xl self-start font-light text-bta-on-secondary-light dark:text-bta-on-secondary-dark"
        >
            {{ title }}
        </h1>

        <div class="flex flex-row justify-center items-center gap-4">
            <button @click="() => (refreshData = !refreshData)">
                <IconsRefresh
                    :colorClass="'fill-bta-on-secondary-light dark:fill-bta-dark'"
                    :size="{ w: '28px', h: '28px' }"
                />
            </button>
            <button @click="() => (settings = !settings)">
                <IconsCog
                    :colorClass="'fill-bta-on-secondary-light dark:fill-bta-dark'"
                    :size="{ w: '28px', h: '28px' }"
                />
            </button>
        </div>
    </div>
</template>
