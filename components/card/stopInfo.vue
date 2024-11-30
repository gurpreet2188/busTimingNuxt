<script setup lang="ts">
const darkTheme = useState("darkTheme");
defineProps({
    stopName: String,
    stopCode: String,
    streetName: String,
    stopPos: Object,
    distanceToStop: Number,
});
</script>

<template>
    <div
        class="flex flex-col justify-center items-start gap-4 p-2 w-[100%] border-b-[1px] border-black/10 dark:border-[#6d6875]/50 text-[#6d6875] dark:text-[#ffcdb2] rounded-md bg-[#ffe5d9] dark:bg-[#1b263b]"
    >
        <div class="flex flex-row justify-center items-center gap-2">
            <h2 class="text-4xl whitespace-nowrap">
                {{ stopCode }}
            </h2>

            <a
                target="_blank"
                :href="`https://www.google.com/maps/search/?api=1&query=${stopPos?.lat},${stopPos?.lon}`"
                class="text-sm bg-[#ffd7ba] font-light p-1 rounded-md text-[#7f5539] dark:text-[#ffcdb2] shadow-sm border border-[#ffcdb2]/0 dark:border-[#ffcdb2] dark:bg-[#1b263b] flex justify-center items-center gap-[0.5rem]"
            >
                <p class="flex flex-row justify-center items-center gap-1">
                    <IconsLocation
                        :color="darkTheme ? '#ffcdb2' : '#7f5539'"
                        :size="{ w: '14px', h: '14px' }"
                    />
                    {{ distanceToStop ? distanceToStop + " km" : "" }}
                </p>
            </a>
        </div>
        <div class="flex flex-col justify-between items-start w-[100%]">
            <p class="line-clamp-1 text-lg">{{ stopName }}</p>
            <div class="flex flex-row justify-between items-center w-[100%]">
                <p class="line-clamp-1 text-sm">{{ streetName }}</p>
            </div>
        </div>
    </div>
</template>
