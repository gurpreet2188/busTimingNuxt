<script setup lang="ts">

// const welcomePage: Ref<boolean> = useState('welcomePage')
const loginPage: Ref<boolean> = useState('loginPage')
const transitionLoad: Ref<boolean> = useState('transitionLoad')
const settings: Ref<boolean> = useState('settings')
const authBtnText: Ref<string> = ref('Logout')
const darkTheme = useState('darkTheme')
const currentUser = useCurrentUser()
const authMessage: Ref<boolean> = ref(false)
const welcomePage: Ref<boolean> = useState('welcomePage')
const loadBusInfo: Ref<boolean> = useState('loadBusInfo')

const handleAuth = () => {
    if (currentUser.value?.uid) {
        useFirebaseAuth()?.signOut()
        authMessage.value = false
        settings.value = false
        welcomePage.value = true
        loadBusInfo.value = false
    } else {
        loginPage.value = true
        transitionLoad.value = false
        settings.value = false
    }

}

watchEffect(() => {
    if (currentUser.value?.uid) {
        authBtnText.value = 'Logout'
    } else {
        authBtnText.value = 'Login'
    }
})

watch(authMessage, () => {
    if (authMessage) {
        if (!currentUser) {
            setTimeout(() => {
                authMessage.value = false
            }, 2000);
        }
    }
})

const handleBtnClose = () => {
    settings.value = false
}

</script>

<template>
    <div class="card-common items-start w-[90%] shadow-xl bg-[#ffcdb2] dark:bg-[#0d1b2a]">
        <div class="flex justify-between items-center w-[100%] text-[#6d6875] dark:text-[#ffcdb2]">
            <h2 class="text-xl font-light tracking-wider">Settings</h2>
            <button @click="handleBtnClose">
                <IconsClose :color="darkTheme ? '#ffcdb2' : '#6d6875'" :size="{ w: '16px', h: '16px' }" />
            </button>

        </div>
        <div>
            <div>
                <button @click="handleAuth" class="btn-common">{{ authBtnText }}</button>
                <p v-if="authMessage">Loggin Out...</p>
            </div>
        </div>
    </div>
</template>