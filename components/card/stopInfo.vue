<script setup lang="ts">
const darkTheme = useState("darkTheme");
const props = defineProps({
    fav: Boolean,
    stopName: String,
    stopCode: String,
    streetName: String,
    stopPos: Object,
    distanceToStop: Number,
});

const favClickhandle = () => {
    if (props.stopCode) {
        useFavStop(props.stopCode, !props.fav);
    }
};
</script>

<template>
    <div
        class="flex flex-col justify-center items-start gap-4 p-2 text-bta-inverted dark:text-bta-dark rounded-lg bg-bta-elevated-light dark:bg-bta-elevated-dark w-full"
    >
        <div class="flex flex-row justify-between items-center gap-2 w-full">
            <div
                class="flex flex-row justify-center items-center justify-self-start"
            >
                <h2 class="text-4xl font-light whitespace-nowrap">
                    {{ stopCode }}
                </h2>

                <a
                    target="_blank"
                    :href="`https://www.google.com/maps/search/?api=1&query=${stopPos?.lat},${stopPos?.lon}`"
                    class="text-sm p-1 rounded-md font-bold flex justify-center items-center gap-[0.5rem]"
                >
                    <p
                        class="flex flex-row justify-center items-center gap-1 text-lg font-light"
                    >
                        <IconsLocation
                            class="fill-bta-dark"
                            :size="{ w: '26px', h: '26px' }"
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
                class="flex justify-center items-center justify-self-end"
            >
                <IconsFavs
                    :class="
                        fav
                            ? ' p-1 rounded-full fill-bta-light dark:fill-bta-dark bg-bta-secondary-light dark:bg-bta-secondary-dark'
                            : 'fill-bta-inverted dark:fill-bta-dark'
                    "
                    :size="{ w: '32px', h: '32px' }"
                />
            </button>
        </div>
        <div class="flex flex-col justify-between items-start w-[100%]">
            <p class="line-clamp-1 text-lg font-bold">{{ stopName }}</p>
            <div class="flex flex-row justify-between items-center w-[100%]">
                <p class="line-clamp-1 text-sm">{{ streetName }}</p>
            </div>
        </div>
    </div>
</template>
