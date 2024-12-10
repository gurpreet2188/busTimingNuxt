<script setup lang="ts">
defineProps<{ busType: string }>();
const size = {
    w: "20px",
    h: "20px",
};
const color = "fill-bta-inverted-white dark:fill-bta-inverted-black";
</script>

<template>
    <IconsBusSingle
        v-show="busType === 'SD'"
        :colorClass="color"
        :size="size"
        :active="true"
    />
    <IconsBusDouble
        v-show="busType === 'DD'"
        :colorClass="color"
        :size="size"
        :active="true"
    />
    <IconsBusBendy
        v-show="busType === 'BD'"
        :colorClass="color"
        :size="size"
        :active="true"
    />
</template>
