<script setup lang="ts">
import BusType from "./busType.vue";
const props = defineProps<{
    stopName: string;
    stopCode: string;
    arrivalEstimate?: number;
    load: string;
    type: string;
    isTracked: number;
}>();
const commonTextCss = "text-bta-900 dark:text-bta-100 font-extrabold";
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

console.log(props.load);
</script>
<template>
    <div class="flex flex-col justify-center items-start gap-2 w-full">
        <p :class="commonTextCss" class="line-clamp-1">
            {{ arrivalEstimate! >= 2 ? "Next bus arriving in" : "Next bus is" }}
        </p>
        <div class="flex justify-end items-end">
            <p
                :style="{ color: busLoadColor }"
                :class="commonTextCss"
                class="text-6xl line-clamp-1"
            >
                {{
                    arrivalEstimate! >= 2
                        ? arrivalEstimate + " mins"
                        : "Arriving"
                }}
            </p>
            <button
                aria-label="Check Bus Type and is it wheelchair accessbile"
                class="overflow-hidden w-[42px] h-[42px] p-2 pb-0"
                @click="handleShowWheelchairIcon"
            >
                <TransitionGroup name="slide-out" class="relative">
                    <IconsWheelChair
                        key="wheelchairIcon"
                        v-if="showWA"
                        :size="{ w: '32px', h: '32px' }"
                        class="mt-auto mb-0 fill-bta-900 dark:fill-bta-100"
                    />
                    <BusType
                        key="busTypeIcon"
                        v-else
                        :bus-type="type"
                        :size="{ w: '32px', h: '32px' }"
                        class=""
                    />
                </TransitionGroup>
            </button>
        </div>
        <p
            class="font-extrabold text-center text-bta-700/80 dark:text-bta-200/80"
        >
            {{ isTracked === 1 ? "Live" : "Scheduled" }}
        </p>
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
