<script setup lang="ts">
const props = defineProps<{
    title: string;
    handleOnSubmit: () => void;
    modelValue: { text: string };
}>();

const emit = defineEmits(["update:modelValue"]);

const value = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", value.value);
    },
});
</script>

<template>
    <form
        class="flex flex-col justify-start items-start gap-4 w-full"
        @submit.prevent="() => handleOnSubmit()"
    >
        <h2 class="text-lg text-bta-light dark:text-bta-dark w-full">
            Search for Services and Bus Stops
        </h2>
        <div class="flex flex-row justify-start items-center gap-2 w-full">
            <div class="flex flex-col justify-center items-start gap-2 w-full">
                <input
                    class="text-bta-light dark:text-bta-dark text-2xl p-2 bg-transparent border-b-[1px] border-bta-light dark:border-bta-dark w-[95%]"
                    name="search"
                    placeholder="..."
                    v-model.trim="value.text"
                />
                <!-- <label for="search" class="text-black dark:text-white text-xs">
                    For e.g: BusStopCode: 75009 or Service: 147</label
                > -->
            </div>
            <button
                class="text-black dark:text-white p-2 rounded-full bg-bta-elevated-light/10 dark:bg-bta-elevated-dark/10"
                type="submit"
            >
                <IconsSearch
                    :size="{ w: '24px', h: '24px' }"
                    class="fill-bta-light dark:fill-bta-dark"
                />
            </button>
        </div>
    </form>
</template>
