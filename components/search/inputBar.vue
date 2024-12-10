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
                    class="text-[#e0e2db] dark:text-[#172a3a] placeholder-[#e0e2db]/50 dark:placeholder-[#172a3a]/80 p-2 rounded-md bg-[#5f7470] dark:bg-[#508991]"
                    name="search"
                    placeholder="Bus Number or Stop Code..."
                    v-model.trim="value.text"
                />
                <label for="search" class="text-black dark:text-white text-xs">
                    For e.g: BusStopCode: 75009 or Service: 147</label
                >
            </div>
            <button
                class="text-black dark:text-white self-start p-2 rounded-md dark:bg-[#1b263b]"
                type="submit"
            >
                Submit
            </button>
        </div>
    </form>
</template>
