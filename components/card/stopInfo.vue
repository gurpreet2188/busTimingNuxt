<script setup lang="ts">
import SaveBtn from "./saveBtn.vue";

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
        class="flex flex-col justify-center items-start gap-4 p-2 text-bta-light dark:text-bta-dark w-full border-b-2 border-bta-light/20"
    >
        <div class="flex flex-row justify-between items-center gap-2 w-full">
            <div
                class="flex flex-row justify-center items-center justify-self-start gap-2"
            >
                <p class="text-xl whitespace-nowrap">
                    {{ stopCode }}
                </p>

                <a
                    target="_blank"
                    :href="`https://www.google.com/maps/search/?api=1&query=${stopPos?.lat},${stopPos?.lon}`"
                    class="p-1 bg-bta-elevated-light/10 rounded-lg"
                >
                    <p
                        class="flex flex-row justify-center items-center gap-1 text-lg"
                    >
                        <IconsLocation
                            class="fill-bta-light dark:fill-bta-dark"
                            :size="{ w: '23px', h: '23px' }"
                        />
                        {{
                            distanceToStop
                                ? distanceToStop.toFixed(2) + " km"
                                : ""
                        }}
                    </p>
                </a>
            </div>
            <SaveBtn :code="stopCode!" />
        </div>
        <div class="flex flex-col justify-between items-start w-[100%]">
            <p class="line-clamp-1 text-2xl">{{ stopName }}</p>
            <div class="flex flex-row justify-between items-center w-[100%]">
                <p class="line-clamp-1 text-lg">{{ streetName }}</p>
            </div>
        </div>
    </div>
</template>
