<script setup lang="ts">
const props = defineProps<{
    serviceCode: string;
    origin: string;
    destination: string;
    stops?: string[];
}>();

definePageMeta({ key: "location" });
const isLoop: Ref<boolean> = ref(false);
const textCss =
    "text-bta-900 dark:text-bta-50 text-sm font-extrabold line-clamp-1";
// const handleClick = async (service: string) => {
//     await navigateTo(SERVICE + "/" + service);
// };

onMounted(async () => {
    isLoop.value = props.origin === props.destination;
});
</script>
<template>
    <button
        @click="async () => await navigateTo(SERVICE + '/' + serviceCode)"
        class="flex justify-between items-center p-4 bg-bta-300 dark:bg-bta-700 w-full"
    >
        <div
            class="relative flex flex-col justify-start items-start gap-4 w-full max-h-16 overflow-y-auto text-bta-800 dark:text-bta-100"
        >
            <p class="flex justify-center items-center gap-2 font-bold text-sm">
                <span
                    class="inline-block h-3 min-w-3 bg-bta-800 dark:bg-bta-100 rounded-full"
                ></span>
                {{ origin }}
            </p>

            <div
                class="flex flex-col items-start gap-2 px-4 ml-1 border-dashed border-l-4 border-bta-800/60 dark:border-bta-100/60"
            >
                <p
                    v-for="stop of stops"
                    class="text-xs font-extrabold line-clamp-1 text-bta-800/60 dark:text-bta-100/60"
                >
                    {{ stop != origin || stop != destination ? stop : "" }}
                </p>
            </div>
            <p class="flex justify-center items-center gap-2 font-bold text-sm">
                <span
                    class="inline-block h-3 min-w-3 bg-bta-800 dark:bg-bta-100 rounded-sm"
                ></span>
                {{ destination }}
            </p>
        </div>
        <!-- <div
            class="relative grid grid-cols-[1rem,auto] justify-items-start place-items-center gap-2"
        >
            <span
                :style="{ left: isLoop ? '1.9px' : '4.9px' }"
                class="absolute h-[15%] w-[2px] bg-bta-900 dark:bg-bta-50"
            />
            <span
                v-if="isLoop"
                class="absolute h-[15%] w-[2px] bg-bta-900 dark:bg-bta-50 left-[7.9px]"
            />
            <span
                class="w-3 h-3 border-[2px] border-bta-900 dark:border-bta-50 rounded-full"
                :class="isLoop ? 'bg-bta-900 dark:bg-bta-50' : ''"
            />
            <p :class="textCss" class="">
                {{ origin ? origin : "--" }}
            </p>
            <span class="w-3 h-3 bg-bta-900 dark:bg-bta-50 rounded-full" />
            <p :class="textCss" class="">
                {{ destination ? destination : "--" }}
            </p>
        </div> -->
        <h2 class="text-4xl font-extrabold text-bta-900 dark:text-bta-50">
            {{ serviceCode }}
        </h2>
    </button>
</template>
