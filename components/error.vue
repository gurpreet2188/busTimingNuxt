<script setup lang="ts">
defineProps<{ msg: string }>();
</script>
<template>
    <div class="flex flex-col justify-center items-center h-screen w-full">
        <IconsError
            class="fill-bta-light dark:fill-bta-dark"
            :size="{ w: '32px', h: '32px' }"
        />
        <h2 class="text-bta-light dark:text-bta-dark text-xl text-center">
            {{ msg }}
        </h2>
    </div>
</template>
