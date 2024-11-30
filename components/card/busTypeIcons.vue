<script setup lang="ts">
defineProps({ busType: String, color: String });
const size = {
    w: "24px",
    h: "24px",
};
</script>

<template>
    <IconsBusSingle v-show="busType === 'SD'" :color="color" :size="size" />
    <IconsBusDouble v-show="busType === 'DD'" :color="color" :size="size" />
    <IconsBusBendy v-show="busType === 'BD'" :color="color" :size="size" />
</template>
