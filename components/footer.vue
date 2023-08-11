<script setup lang="ts">


const size = {h:'24px', w:'24px'}

const filterFavs:Ref<boolean> = useState('filterFavs')

const clickHandle = (val:boolean) =>{
    return filterFavs.value = val
}

</script>

<template>
    <div class="flex justify-center items-center w-[100%] h-[100%] lg:shadow-lg  lg:rounded-lg bg-blue-50">
        <div class="flex justify-center items-center w-[50%]">
            <button @click="()=>{clickHandle(false)}">
                <IconsLocation :color="'#000'" :size="size" :active="!filterFavs"/>
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button @click="()=>{clickHandle(true)}">
                <IconsFavs :color="'#000'" :size="size" :active="filterFavs"/>
            </button>
        </div>
    </div>
</template>