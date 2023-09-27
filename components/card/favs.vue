<script setup lang="ts">


const favs = useState('favs')
const props = defineProps({ fav: Boolean, stopCode: String })

const clickHandle = () => {
    if (props.stopCode) {
        if (!localStorage.getItem('favs')) {
            localStorage.setItem('favs', JSON.stringify([props.stopCode]))
            favs.value = [props.stopCode]
        } else if (localStorage.getItem('favs')) {
            const temp: string[] = JSON.parse(localStorage.getItem('favs') as string)

            if (temp.includes(props.stopCode)) {
                const newTemp = temp.filter(v=> v !== props.stopCode)
                localStorage.removeItem('favs')
                localStorage.setItem('favs', JSON.stringify([...newTemp]))
                favs.value = newTemp
                
            }else {
                localStorage.removeItem('favs')
                localStorage.setItem('favs', JSON.stringify([...temp, props.stopCode]))
                favs.value = [...temp, props.stopCode]
            }

        }
    }


}

</script>

<template>
    <button @click="clickHandle" class=" flex justify-center items-center rounded-full w-[100%] h-[100%] p-4 bg-[#b5838d] dark:bg-[#1b263b]">
        <div>
            <IconsFavs :color="'#ffcdb2'" :active="fav" :size="{w:'16px', h:'16px'}"/>
        </div>
    </button>
</template>