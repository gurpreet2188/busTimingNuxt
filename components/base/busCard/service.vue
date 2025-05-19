<script setup lang="ts">
const props = defineProps<{
    serviceCode: string;
    destination: string;
}>();

definePageMeta({ key: "location" });
// const isLoop: Ref<boolean> = ref(false);
// onMounted(async () => {
//     isLoop.value = props.origin === props.destination;
// });
</script>
<template>
    <button
        @click="async () => await navigateTo(SERVICE + '/' + serviceCode)"
        class="flex justify-between items-center gap-2 p-4 bg-bta-300 dark:bg-bta-700 w-full"
    >
        <div
            class="relative flex flex-col justify-start items-start gap-4 w-full max-h-16 overflow-y-auto text-bta-800 dark:text-bta-100"
        >
            <p class="flex justify-center items-center gap-2 font-bold text-lg">
                -> {{ destination }}
            </p>
        </div>

        <h2 class="text-4xl font-extrabold text-bta-900 dark:text-bta-50">
            {{ serviceCode }}
        </h2>
    </button>
</template>
