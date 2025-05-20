<script lang="ts" setup>
const props = defineProps<{ stops: string[] }>();
// const stops = [
//     "2 Stops",
//     "Punggol Stn",
//     "6 Stops",
//     "Sengkang Stn",
//     "8 Stops",
//     "Hougoung Stn",
//     "2 Stops",
//     "Punggol Stn",
//     "6 Stops",
//     "Sengkang Stn",
//     "8 Stops",
//     "Hougoung Stn",
// ];

const stopsNum = computed(() => props.stops.filter((v) => v.includes("Stop")));
const stopsName: Ref<string[]> = computed(() =>
    props.stops.filter((v) => !v.includes("Stop")),
);

// const cleanStnText = (name: string) => {
//     return name
//         .toLowerCase()
//         .replace(/\b(aft|bef|opp)\b/gi, "")
//         .trim()
//         .replace(/\s+/g, " ");
// };
</script>
<template>
    <div
        class="flex flex-col justify-end gap-2 overflow-x-auto scrollbar-none w-auto p-2 min-h-[5rem]"
    >
        <div
            class="flex gap-6 border-dashed border-t-4 border-bta-800/30 dark:border-bta-200/40 min-w-fit"
        >
            <p
                class="relative whitespace-nowrap text-bta-800 dark:text-bta-300 font-extrabold text-xs capitalize py-2"
                v-for="(name, i) of stopsName"
            >
                <span
                    class="absolute bottom-[3rem] text-xs text-bta-800/50 dark:text-bta-300/60"
                    >{{ stopsNum[i] }}</span
                >
                <span
                    class="absolute block bottom-[1.98rem] left-[42%] w-[1rem] h-[1rem] bg-bta-800 dark:bg-bta-300 rounded-full"
                ></span>
                {{ name }}
            </p>
        </div>
    </div>
</template>
