<script setup lang="ts">
import type { Stop } from "../types/stops";

const favsStops: Ref<Stop[] | null> = useState("favsStops");
const showEmptyFavsMessage: Ref<boolean> = ref(true);
const title: Ref<string> = useState("title");

onMounted(() => (title.value = "Saved Stops"));
watch(
    favsStops,
    () => {
        if (favsStops.value && favsStops.value!!.length > 0) {
            showEmptyFavsMessage.value = false;
        } else {
            showEmptyFavsMessage.value = true;
        }
    },
    { immediate: true, deep: true },
);
</script>

<template>
    <div class="flex flex-col justify-start items-center gap-2 pb-20 w-full">
        <transition name="fade" mode="out-in">
            <div
                v-if="showEmptyFavsMessage"
                class="flex flex-col justify-center items-center gap-4 w-[100%] h-[80vh] overflow-hidden justify-self-center"
            >
                <IconsBusStop :size="{ w: '48px', h: '48px' }" />
                <p
                    class="text-center tracking-wider text-bta-light dark:text-bta-dark"
                >
                    There are no saved Bus Stops.
                </p>
            </div>
            <LoadingPage
                v-else-if="!favsStops"
                :showBarOnly="true"
                :location="false"
                :error="false"
                :msg="''"
            />
            <div
                v-else
                class="flex flex-col justify-start items-center gap-2 w-full"
            >
                <TransitionGroup
                    name="bslist"
                    tag="div"
                    class="flex flex-col gap-8 w-[100%]"
                >
                    <BusCard
                        v-for="(stop, index) in favsStops"
                        :fav="true"
                        :stop-name="stop.description"
                        :stop-code="stop.code"
                        :bg-color-shift="index"
                        :street-name="stop.street"
                        :services="stop.services"
                        :distance-to-stop="stop.distance"
                        :stop-pos="{ lat: stop.lattitude, lon: stop.longitude }"
                        :key="stop.code + 'f'"
                    />
                </TransitionGroup>
            </div>
        </transition>
    </div>
</template>

<style>
.bslist-move,
/* apply transition to moving elements */
.bslist-enter-active,
.bslist-leave-active {
    transition: all 0.7s ease;
}

.bslist-enter-from,
.bslist-leave-to {
    opacity: 0;
    transform: translateX(200%);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.bslist-leave-active {
    position: absolute;
}
</style>
