<script setup lang="ts">
// const props = defineProps({})
const darkTheme = useState('darkTheme')
const loginPage = useState('loginPage')
const welcomePage = useState('welcomePage')
const loadingPage = useState('loadingPage')
const skipLogIn = useState('skipLogIn')
const loginBtnClickHandle = ()=>{
    loginPage.value = true
}

const locateBusStopClickHandle = ()=>{
    welcomePage.value = false
    loadingPage.value = true
    skipLogIn.value = true
}
</script>

<template>
    
    <div class="flex flex-col justify-center items-center gap-[2rem] w-[100%] text-[#6d6875] dark:text-[#ffcdb2]">
        <!-- title -->
       <div class="card-common w-[100%]">
         <!-- info -->
         <p class="text-center text-xl">Locate nearest Bus Stops and get real-time Bus arrival timings.</p>
        <!-- Account -->
       <div class="flex flex-col justify-center items-center gap-[0.5rem]">
        <button @click="loginBtnClickHandle" class="btn-common"><IconsAccount :color="'#ffcdb2'" :size="{ w: '24px', h: '24px' }"/>  Login / Register</button>
        <p class="inline-block text-center">Sync your <span class="inline-block"><IconsFavs :color="darkTheme ? '#ffcdb2' : '#6d6875'" :active="true" :size="{w:'16px', h:'16px'}"/></span> Bus Stops across devices.</p>
       </div>
        <p class="text-xl">Or</p>
        <!-- locate bus stop -->
        <button @click="locateBusStopClickHandle" class="btn-common w-auto"><IconsLocation :color="'#ffcdb2'" :size="{ w: '22px', h: '22px' }" :active="true"/> Locate Nearest Bus Stops</button>
       
        <!-- credit -->
    </div>
        <!-- LTA -->
        <!-- Github -->
    </div>
</template>