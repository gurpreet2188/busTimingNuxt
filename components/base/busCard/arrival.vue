<script setup lang="ts">
import { IconsWheelChair } from "#components";
import BusType from "./busType.vue";

const props = defineProps<{
    arrvivalEstMin?: number;
    type: string;
    load: string;
    wab: boolean;
}>();
const darkTheme: Ref<boolean> = useState("darkTheme");
const showWA: Ref<boolean> = ref(false);
const showWATimeout: Ref<number> = ref(0);

const busLoadColor = computed(() => {
    if (props.load) {
        // g - 99d98c , o- ffb600,
        if (darkTheme.value) {
            return props.load === "SEA"
                ? "#99d98c"
                : props.load === "SDA"
                  ? "#ffb600"
                  : "#ff4d6d";
        } else {
            return props.load === "SEA"
                ? "#398463"
                : props.load === "SDA"
                  ? "#ff7d00"
                  : "#ae2012";
        }
    }
});

const handleShowWheelchairIcon = () => {
    window.clearTimeout(showWATimeout.value);
    showWA.value = !showWA.value;
    if (showWA) {
        showWATimeout.value = window.setTimeout(() => {
            showWA.value = false;
            window.clearTimeout(showWATimeout.value);
        }, 8000);
        return;
    }
    return;
};
</script>

<template>
    <div
        v-if="arrvivalEstMin"
        class="flex flex-col justify-center items-center gap-0"
    >
        <p :style="{ color: busLoadColor }" class="font-extrabold text-lg">
            {{ arrvivalEstMin! <= 1 ? "Arr" : arrvivalEstMin }}
        </p>

        <p
            :style="{ color: busLoadColor }"
            class="text-extrabold font-extrabold"
        >
            {{ arrvivalEstMin! <= 1 ? "--" : "mins" }}
        </p>
        <button
            aria-label="Check Bus Type and is it wheelchair accessbile"
            class="flex justify-center items-center overflow-hidden w-[36px] h-[36px] p-2"
            @click="handleShowWheelchairIcon"
            v-if="arrvivalEstMin"
        >
            <TransitionGroup name="slide-out" class="relative">
                <IconsWheelChair
                    key="wheelchairIcon"
                    v-if="showWA"
                    :size="{ w: '24px', h: '24px' }"
                    class="self-end fill-bta-light dark:fill-bta-dark"
                />
                <BusType key="busTypeIcon" v-else :bus-type="type" />
            </TransitionGroup>
        </button>
    </div>
</template>
<style>
.slide-out-enter-active,
.slide-out-leave-active {
    transition: all 1s ease;
}
.slide-out-leave-to {
    position: absolute;
}

.slide-out-enter-from,
.slide-out-leave-to {
    opacity: 0;
    transform: translateX(-70%);
}
</style>
