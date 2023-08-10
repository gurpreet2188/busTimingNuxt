<script setup lang="ts">
defineProps({busType:String})
const size = {
    w:'16px',
    h:'16px'
}
</script>

<template>
    <IconsBusSingle v-show="busType === 'SD'" :color="'#000'" :size="size" />
    <IconsBusDouble v-show="busType === 'DD'" :color="'#000'"  :size="size"/>
</template>