<script setup lang="ts">
import { useFirebaseAuth } from "vuefire";
import { getAuth, signOut } from "firebase/auth";
import "firebaseui/dist/firebaseui.css";
import { busStore } from "../busFirebase/busStore";
import {
    EmailAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

const router = useRouter();
const title: Ref<string> = useState("title");

onMounted(() => (title.value = "Login/Register"));

const LOGGEDINSTATE = {
    LOADING: "loading",
    IN: "loggedIn",
    OUT: "loggedOut",
};

const isLoggedIn: Ref<string> = useState("isLoggedIn");

let auth = null;
const cancelHandle = async () => {
    router.back();
};

const handleSignOut = () => {
    signOut(getAuth())
        .then(() => {
            console.log("signed out");
        })
        .catch((err) => console.error(err));
    // if (currentUser) {
    //     useFirebaseAuth()?.signOut();
    // }
};

const config = {
    signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl: "/",
};

const handleGooglePopupLogin = () => {
    isLoggedIn.value = LOGGEDINSTATE.LOADING;
    signInWithPopup(auth!, new GoogleAuthProvider())
        .then((d) => {
            if (d.user.uid) {
                busStore().initialize(d.user.uid);
                isLoggedIn.value = LOGGEDINSTATE.IN;
            }
        })
        .catch((err) => {
            console.error(err);
            isLoggedIn.value = LOGGEDINSTATE.OUT;
        });
};

onMounted(async () => {
    auth = useFirebaseAuth();
    // props?.firebaseUi?.start("#firebaseui-auth-container", config)
});
</script>

<template>
    <div
        class="flex flex-col justify-center items-center gap-4 pt-10 w-full h-full"
    >
        <div v-if="isLoggedIn === LOGGEDINSTATE.LOADING" class="loader"></div>
        <IconsAccount
            :size="{ w: '128px', h: '128px' }"
            class="fill-bta-light dark:fill-bta-dark"
        />
        <div
            class="flex flex-col justify-center items-center gap-4 rounded-md p-4 py-8"
            :style="{
                display:
                    isLoggedIn === LOGGEDINSTATE.OUT
                        ? 'flex'
                        : isLoggedIn === LOGGEDINSTATE.IN
                          ? 'none'
                          : 'none',
            }"
        >
            <!-- <div class="flex flex-col justify-center items-center gap-[1rem]" id="firebaseui-auth-container"></div> -->
            <button
                @click="handleGooglePopupLogin"
                class="flex flex-row justify-center items-center gap-2 text-xl rounded-md bg-white text-black p-2"
            >
                <IconsGoogle /> <span>Login/Register</span>
            </button>
            <button
                @click="cancelHandle"
                class="p-2 text-xl text-bta-light dark:text-bta-dark"
            >
                Cancel
            </button>
        </div>
        <button
            v-if="isLoggedIn === LOGGEDINSTATE.IN"
            @click="handleSignOut"
            class="p-2 text-xl text-bta-light dark:text-bta-dark"
        >
            Sign Out
        </button>
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
