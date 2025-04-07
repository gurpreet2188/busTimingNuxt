<script setup lang="ts">
const props = defineProps<{
    stops: number;
    services: { [key: string]: boolean };
    activeService: string;
}>();

const emit = defineEmits(["service-event"]);
const handleServiceEvent = (service: string) => {
    emit("service-event", service);
};
const runningServices = computed(() =>
    Object.entries(props.services)
        .filter((s) => s[1])
        .flatMap((v) => v[0]),
);
const notRunningServices = computed(() =>
    Object.entries(props.services)
        .filter((s) => !s[1])
        .flatMap((v) => v[0]),
);
</script>
<template>
    <div class="flex flex-col justify-center items-center gap-2 w-full">
        <p class="text-xl dark:text-bta-50 text-bta-900 font-extrabold">
            Active Services
        </p>
        <div class="grid grid-cols-4 gap-2 w-full">
            <button
                v-for="service of runningServices"
                @click="
                    () => {
                        handleServiceEvent(service);
                    }
                "
                class="p-1 text-xl font-extrabold text-bta-900 border-bta-900 dark:border-bta-50 dark:text-bta-50 border-[2px] bg-bta-300 dark:bg-bta-700 rounded-md"
                :class="
                    activeService === service
                        ? 'border-opacity-1 dark:border-opacity-1'
                        : 'border-opacity-0 dark:border-opacity-0'
                "
                :style="{ display: services[service] ? 'block' : 'none' }"
            >
                {{ service }}
            </button>
        </div>
    </div>
</template>
