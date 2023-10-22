 <script setup lang="ts">
const props = defineProps({ message: String, wait:Boolean })
const active: Ref<boolean> = useState('active', () => false)
if (props.wait) {
    setTimeout(()=>{
        active.value = true
    },200)
}

watchEffect(()=>{
    if(!props.wait) {
    setTimeout(() => {
        active.value = false
    }, 3000)
}
console.log(props.wait)
})

</script>

<template>
    <Transition name="slide-fade">
        <div v-if="active"
            class="flex-col justify-start items-center bg-white/50 p-2 py-4 w-[90%] rounded-md shadow-xl filter backdrop-filter backdrop-blur-sm">
            <p class="">{{ message }}</p>

        </div>
    </Transition>
</template>