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
        <h2 class="text-xl text-black dark:text-white w-full font-light">
            Search for Services and Bus Stops
        </h2>
        <div class="flex flex-row justify-start items-center gap-2 w-full">
            <div class="flex flex-col justify-center items-start gap-2 w-full">
                <input
                    class="text-bta-light dark:text-bta-dark text-3xl p-2 bg-transparent border-b-2 border-bta-light dark:border-bta-dark w-[95%]"
                    name="search"
                    placeholder="..."
                    v-model.trim="value.text"
                />
                <label for="search" class="text-black dark:text-white text-xs">
                    For e.g: BusStopCode: 75009 or Service: 147</label
                >
            </div>
            <button
                class="text-black dark:text-white self-start p-2 px-4 rounded-md"
                type="submit"
            >
                <IconsSearch
                    :size="{ w: '42px', h: '42px' }"
                    class="fill-bta-light dark:fill-bta-dark"
                />
            </button>
        </div>
    </form>
</template>
