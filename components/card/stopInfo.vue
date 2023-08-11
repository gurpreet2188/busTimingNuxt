<script setup lang="ts">
defineProps({ stopName: String, stopCode: String, streetName: String, stopPos: Object, distanceToStop: Number })

const divRef: Ref<HTMLDivElement | null> = ref(null)
const titleRef: Ref<HTMLHRElement | null> = ref(null)
onMounted(() => {
    if (divRef.value && titleRef.value) {
        // console.log(divRef.value.clientWidth, titleRef.value.clientWidth)
        if ((titleRef.value.clientWidth+4) >= divRef.value.clientWidth) {
            const diff = divRef.value.clientWidth / titleRef.value.clientWidth
            // formula to auto-resize text length for title, 
            // (defaultFontSize x 16) - ((defaultFontSize * 16) * (1 - difference of text length vs parent div length))
            // defaultFontSize is 0.1 is less to fit the text within the parent div padding.
            // different font and font styles (letter spacing) may require different adjustments for defaultFontSize
            titleRef.value.style.fontSize = ((1.2 * 16) - ((1.2 * 16) * (1 - diff))) + 'px'
        }

    }
})
</script>

<template>
    <div ref="divRef"
        class="flex flex-col justify-center items-start gap-[0.5rem] p-[0.5rem] w-[100%] border-b-[1px] border-black/10">
        <h2 ref="titleRef" class="text-[1.3rem] whitespace-nowrap ">{{stopName}} ({{
            stopCode }})</h2>
        <div class="flex justify-between items-center w-[100%]">
            <div class="w-[50%]">
                <p class="font-light text-xs">{{ streetName }}</p>
            </div>
            <a target="_blank" :href="`https://www.google.com/maps/search/?api=1&query=${stopPos?.lat},${stopPos?.lon}`"
                class="text-xs font-light p-1 rounded-full border border-black/20 flex gap-[0.5rem]">
                <IconsNavigateTo :color="'#000'" :size="{w:'16px',h:'16px'}"/>
                {{ distanceToStop ? distanceToStop + ' km' : 'Go To' }}</a>
        </div>
    </div>
</template>