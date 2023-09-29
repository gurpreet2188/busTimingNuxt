<script setup lang="ts">
defineProps({ stopName: String, stopCode: String, streetName: String, stopPos: Object, distanceToStop: Number })

// const divRef: Ref<HTMLDivElement | null> = ref(null)
// const titleRef: Ref<HTMLHRElement | null> = ref(null)
// onMounted(() => {
//     if (divRef.value && titleRef.value) {
//         console.log(divRef.value.clientWidth, titleRef.value.clientWidth)
//         if ((titleRef.value.clientWidth+32) >= divRef.value.clientWidth) {
//             const diff = divRef.value.clientWidth / titleRef.value.clientWidth
//             // formula to auto-resize text length for title, 
//             // (defaultFontSize x 16) - ((defaultFontSize * 16) * (1 - difference of text length vs parent div length))
//             // defaultFontSize is 0.1 is less to fit the text within the parent div padding.
//             // different font and font styles (letter spacing) may require different adjustments for defaultFontSize
//             titleRef.value.style.fontSize = ((1.17 * 16) - ((1.17 * 16) * (1 - diff))) + 'px'
//         }
//     }
// })
</script>

<template>
    <div
        class="flex flex-col justify-center items-start gap-[1rem] p-[1rem] w-[100%] border-b-[1px] border-black/10 dark:border-[#6d6875]/50 bg-[#ffb4a2] dark:bg-[#1b263b]/0 text-[#6d6875] dark:text-[#ffcdb2]">
        <a target="_blank" :href="`https://www.google.com/maps/search/?api=1&query=${stopPos?.lat},${stopPos?.lon}`"
            class="text-xs bg-[#b5838d] font-light p-2 rounded-md text-[#ffcdb2] shadow-sm border border-[#ffcdb2]/0 dark:border-[#ffcdb2] dark:bg-[#1b263b] flex justify-center items-center gap-[0.5rem]">
            <h2 class="text-[1.3rem] whitespace-nowrap">
                {{ stopCode }}
            </h2> /
            <IconsNavigateTo :color="'#ffcdb2'" :size="{ w: '12px', h: '12px' }" />
            {{ distanceToStop ? distanceToStop + ' km' : 'Go To' }}
        </a>
        <div class="flex flex-col justify-between items-start w-[100%]">
            <p class="line-clamp-1">{{ stopName }}</p>
            <p class="text-sm">{{ streetName }}</p>
        </div>
    </div>
</template>