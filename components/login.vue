<script setup lang="ts">
// import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
// import { useReadStore } from 'composables/useReadStore';
import * as firebaseui from 'firebaseui';
import { useFirebaseAuth } from 'vuefire';
// import { collection, doc, addDoc, setDoc } from 'firebase/firestore';
import { useCurrentUser } from 'vuefire';


const currentUser = useCurrentUser()
const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(useFirebaseAuth())



onMounted(async () => {
    ui.start("#firebaseui-auth-container", useAuthConfig())

})

const handleSignOut = () => {
    if (currentUser) {
        useFirebaseAuth()?.signOut()
    }
}

</script>

<template>
    <div class="flex flex-col justify-center items-center">

        <span v-if="currentUser"> Welcome {{ currentUser.displayName }}</span>
        <span v-else>
            <div id="firebaseui-auth-container"></div>
        </span>
        <button v-if="currentUser" @click="handleSignOut">Sign Out</button>
    </div>
</template>