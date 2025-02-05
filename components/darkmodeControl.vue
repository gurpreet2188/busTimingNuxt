<script setup lang="ts">
const mode = useColorMode();
</script>
<template>
    <div class="flex flex-col justify-center items-start gap-4 w-full">
        <div class="flex flex-row gap-2 w-full text-lg">
            <input
                type="radio"
                id="system"
                value="system"
                v-model="mode.preference"
            />
            <label for="auto">Auto</label>

            <input
                type="radio"
                id="light"
                value="light"
                v-model="mode.preference"
            />
            <label for="light">Light</label>
            <input
                type="radio"
                id="dark"
                value="dark"
                v-model="mode.preference"
            />
            <label for="dark">Dark</label>
        </div>
    </div>
</template>
