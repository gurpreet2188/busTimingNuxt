<script setup lang="ts">
import { useFirebaseAuth } from "vuefire";
import type { COMPONENT_STATE } from "../types/components";
import changeComponentState from "~/helper/componentsState";
import { ComponentsStateKeys } from "../types/components";
import { getAuth, signOut } from "firebase/auth";
import "firebaseui/dist/firebaseui.css";
import { busStore } from "../busFirebase/busStore";
import {
    EmailAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

const LOGGEDINSTATE = {
    LOADING: "loading",
    IN: "loggedIn",
    OUT: "loggedOut",
};

const isLoggedIn: Ref<string> = useState("isLoggedIn");
const componentsState: Ref<COMPONENT_STATE> = useState("component_state");
let auth = null;
const cancelHandle = () => {
    componentsState.value = changeComponentState(ComponentsStateKeys.WELCOME);
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
    <div class="flex flex-col justify-center items-center gap-[2rem] h-full">
        <div v-if="isLoggedIn === LOGGEDINSTATE.LOADING" class="loader"></div>
        <!-- <div v-if="isLoggedIn === true" class="text-[#6d6875] dark:text-[#ffcdb2]"> Welcome {{ currentUser?.displayName
        }}
        </div> -->
        <div
            class="flex flex-col justify-center items-center gap-[1rem]"
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
                class="btn-common bg-white text-black"
            >
                <IconsGoogle /> Login
            </button>
            <button @click="cancelHandle" class="btn-common">Cancel</button>
        </div>
        <button
            v-if="isLoggedIn === LOGGEDINSTATE.IN"
            @click="handleSignOut"
            class="btn-common"
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
