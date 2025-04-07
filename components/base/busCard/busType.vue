<script setup lang="ts">
import type { ConcreteComponent } from "vue";

const props = defineProps<{
    busType: string;
    size?: { w: string; h: string };
}>();
const showIcon: Ref<boolean> = ref(false);
const defaultSize = {
    w: "28px",
    h: "28px",
};
const color = "fill-bta-700 dark:fill-bta-50";

onMounted(() => (showIcon.value = true));

const icon = computed(() => {
    if (props.busType === "SD") {
        return resolveComponent("LazyIconsBusSingle");
    } else if (props.busType === "DD") {
        return resolveComponent("LazyIconsBusDouble");
    }
    return resolveComponent("LazyIconsBusBendy");
});
</script>

<template>
    <Transition name="slide" appear>
        <component
            v-if="showIcon"
            :is="icon"
            class="fill-bta-900 dark:fill-bta-50"
            :size="size ? size : defaultSize"
        />
    </Transition>
</template>
<style>
.slide-enter-active,
.slide-leave-active {
    transition: all 1s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}
</style>
