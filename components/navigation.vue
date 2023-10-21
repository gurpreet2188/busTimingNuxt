<script setup lang="ts">
const darkTheme = useState('darkTheme')
const settings = useState('settings')
</script>

<template>
        <div class="flex justify-between items-center w-[100%]">
                <h1 class="text-4xl font-extralight tracking-wider self-start text-[#6d6875] dark:text-[#ffcdb2]">Bus Timing
                </h1>
                <button @click="() => settings = !settings">
                        <IconsCog :color="darkTheme ? '#ffcdb2' : '#6d6875'" :active="true" :size="{ w: '28px', h: '28px' }" />
                </button>
        </div>
</template>