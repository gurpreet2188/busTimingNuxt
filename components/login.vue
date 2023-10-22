<script setup lang="ts">
import * as firebaseui from 'firebaseui';
import { useFirebaseAuth } from 'vuefire';
import { useCurrentUser } from 'vuefire';
import 'firebaseui/dist/firebaseui.css'
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';

const LOGGEDINSTATE = {
    'LOADING': 'loading',
    'IN': 'loggedIn',
    'OUT': 'loggedOut'
}

const props = defineProps({ firebaseUi: firebaseui.auth.AuthUI })
const currentUser = useCurrentUser()
const loginPage = useState('loginPage')
const welcomePage = useState('welcomePage')
const isLoggedIn: Ref<string> = useState('isLoggedIn')

const loginBtnClickHandle = () => {
    loginPage.value = false
    welcomePage.value = true
}

const handleSignOut = () => {
    if (currentUser) {
        useFirebaseAuth()?.signOut()
    }
}

const config = {
    signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID
    ],
    signInSuccessUrl: "/",
}

onMounted(async () => {
    props?.firebaseUi?.start("#firebaseui-auth-container", config)
})

</script>

<template>
    <div class="flex flex-col justify-center items-center gap-[2rem]">
        <div v-if="isLoggedIn ===  LOGGEDINSTATE.LOADING" class="loader">
        </div>
        <!-- <div v-if="isLoggedIn === true" class="text-[#6d6875] dark:text-[#ffcdb2]"> Welcome {{ currentUser?.displayName
        }}
        </div> -->
        <div class="flex flex-col justify-center items-center gap-[1rem]" :style="{ display: isLoggedIn === LOGGEDINSTATE.OUT ? 'flex' : isLoggedIn === LOGGEDINSTATE.IN ? 'none' : 'none'}">

            <div class="flex flex-col justify-center items-center gap-[1rem]" id="firebaseui-auth-container"></div>
            <button @click="loginBtnClickHandle" class="btn-common">Cancel</button>
        </div>
        <button v-if="isLoggedIn === LOGGEDINSTATE.IN" @click="handleSignOut" class="btn-common">Sign
            Out</button>
    </div>
</template>

<style>
.loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>