<script setup lang="ts">
const props = defineProps<{ code: string; service: string }>();
const removedCode: Ref<string | boolean> = useState("removedCode", () => "");
const isSaved: Ref<boolean> = ref(false);
const size = { w: "24px", h: "24px" };
const timeoutCounter: Ref<number> = ref(0);
const intervalCounter: Ref<number> = ref(0);
const showCancel: Ref<boolean> = ref(false);
const spanRight: Ref<number> = ref(0);

onBeforeMount(() => {
    isSaved.value = useCheckIfSavedStop(`${props.service}-${props.code}`);
});
const handleClick = async () => {
    showCancel.value = isSaved.value ? !showCancel.value : false;
    spanRight.value = 0;
    window.clearTimeout(timeoutCounter.value);
    window.clearInterval(intervalCounter.value);

    if (showCancel.value) {
        intervalCounter.value = window.setInterval(() => {
            if (spanRight.value <= 90) {
                spanRight.value += 10;
            } else {
                window.clearTimeout(intervalCounter.value);
            }
        }, 300);

        timeoutCounter.value = window.setTimeout(async () => {
            await useUpdateSavedStops(props.service, props.code);
            removedCode.value = isSaved.value && props.service + props.code;
            isSaved.value = !isSaved.value;
            showCancel.value = false;
        }, 3200);
    }

    if (!isSaved.value) {
        await useUpdateSavedStops(props.service, props.code);
        isSaved.value = !isSaved.value;
    }
};

// watch(intervalCounter, () => console.log(intervalCounter.value));
onBeforeUnmount(() => {
    window.clearTimeout(timeoutCounter.value);
    window.clearInterval(intervalCounter.value);
});
</script>
<template>
    <button
        @click="handleClick"
        class="flex justify-center items-center gap-1 justify-self-end rounded-full bg-bta-200 dark:bg-bta-800 shadow-lg p-1 transition-all ease-linear duration-200 overflow-hidden"
    >
        <IconsFavsFilled
            class="fill-bta-light/50 dark:fill-bta-dark/50"
            v-if="isSaved && !showCancel"
            :size="size"
        />
        <IconsFavs
            v-if="!isSaved && !showCancel"
            class="fill-bta-900 dark:fill-bta-100"
            :size="size"
        />
        <!-- <div  class="relative w-full h-full"> -->
        <span
            v-if="showCancel"
            :style="{ right: spanRight + '%' }"
            class="absolute top-0 bg-bta-500/60 w-full h-full transition-all ease-linear duration-200"
        ></span>
        <!-- </div> -->
        <p v-if="showCancel">Cancel</p>
    </button>
</template>
