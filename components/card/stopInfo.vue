<script setup lang="ts">
import type { ConcreteComponent } from "vue";
import Btn from "../base/btn.vue";
import SaveBtn from "./saveBtn.vue";
const busStopIcon = resolveComponent("IconsBusStop") as ConcreteComponent;
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
                <Btn
                    :btn-text="stopCode!"
                    :label="'explore bus stop ' + stopCode!"
                    :elevated="true"
                    :with-icon="busStopIcon"
                    :handle-click="
                        async () => await navigateTo(STOP + '/' + stopCode!)
                    "
                />
                <p v-if="distanceToStop" class="text-sm">
                    {{ distanceToStop.toFixed(2) + " km" }}
                </p>
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
