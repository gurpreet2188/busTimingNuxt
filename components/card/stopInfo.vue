<script setup lang="ts">
const props = defineProps({
    fav: Boolean,
    stopName: String,
    stopCode: String,
    streetName: String,
    stopPos: Object,
    distanceToStop: Number,
});
const thisDiv = ref(null);
const favClickhandle = () => {
    if (props.fav) {
        (
            (thisDiv.value!! as HTMLElement).parentNode as HTMLElement
        ).style.height = "0px";
        (
            (thisDiv.value!! as HTMLElement).parentNode as HTMLElement
        ).style.opacity = "0";
    }
    if (props.stopCode) {
        useFavStop(props.stopCode, !props.fav);
    }
};
</script>

<template>
    <div
        ref="thisDiv"
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
            <button
                @click="favClickhandle"
                class="flex justify-center items-center justify-self-end rounded-full bg-bta-elevated-light/10 p-1"
            >
                <IconsFavsFilled
                    class="fill-bta-light/50 dark:fill-bta-dark/50"
                    v-if="fav"
                    :size="{ w: '24px', h: '24px' }"
                />
                <IconsFavs
                    class="fill-bta-light dark:fill-bta-dark"
                    v-if="!fav"
                    :size="{ w: '24px', h: '24px' }"
                />
            </button>
        </div>
        <div class="flex flex-col justify-between items-start w-[100%]">
            <p class="line-clamp-1 text-2xl">{{ stopName }}</p>
            <div class="flex flex-row justify-between items-center w-[100%]">
                <p class="line-clamp-1 text-lg">{{ streetName }}</p>
            </div>
        </div>
    </div>
</template>
