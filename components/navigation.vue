<script setup lang="ts">
defineProps<{ title: string }>();
const settings = useState("settings");
</script>

<template>
    <div class="flex justify-between items-center w-[100%]">
        <h1 class="text-4xl self-start text-bta-light dark:text-bta-dark">
            {{ title }}
        </h1>
        <button @click="() => (settings = !settings)">
            <IconsCog :active="true" :size="{ w: '28px', h: '28px' }" />
        </button>
    </div>
</template>
