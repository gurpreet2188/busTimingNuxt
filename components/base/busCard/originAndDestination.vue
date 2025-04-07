<script setup lang="ts">
const props = defineProps<{
    origin: string;
    destination: string;
}>();
const isLoop: Ref<boolean> = ref(false);

onMounted(async () => {
    isLoop.value = props.origin === props.destination;
});

const textCss = "text-bta-900 dark:text-bta-50 text-sm font-bold line-clamp-1";
</script>
<template></template>
