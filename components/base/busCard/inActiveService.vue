<script setup lang="ts">
defineProps<{ stopCode: string; stopName: string; service: string }>();
</script>
<template>
    <div
        class="flex flex-col justify-start items-center p-4 rounded-xl shadow-lg bg-bta-100 dark:bg-bta-800"
    >
        <p>Currently there are no active services</p>
        <p>{{ stopCode }}</p>
        <p>{{ stopName }}</p>
        <p>{{ service }}</p>
    </div>
</template>
