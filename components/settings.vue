<script setup lang="ts">
import { getAuth, signOut } from "firebase/auth";

import useCheckTotalStops from "~/composables/useCheckTotalStops";
const settings: Ref<boolean> = useState("settings");
const authBtnText: Ref<string> = ref("Logout");
const currentUser = useCurrentUser();
const authMessage: Ref<boolean> = ref(false);
const savedStops:Ref<number |null> = ref(null)
const mode = useColorMode();
onMounted(async()=>{
  if(currentUser?.value){
    savedStops.value = await useCheckTotalStops(currentUser?.value.uid)
  }
})
const handleAuth = () => {
    if (currentUser.value?.uid) {
        signOut(getAuth())
            .then(() => {
                console.log("signed out");
            })
            .catch((err) => console.error(err));
        setTimeout(()=>{
          authMessage.value = false;
          settings.value = false;
          navigateTo(LOCATION_BASED)
        },2000)
    } else {
        navigateTo(AUTH)
        settings.value = false;
    }
};

watchEffect(() => {
    if (currentUser.value?.uid) {
        authBtnText.value = "Logout";
    } else {
        authBtnText.value = "Login";
    }
});

watch(authMessage, () => {
    if (authMessage) {
        if (!currentUser) {
            setTimeout(() => {
                authMessage.value = false;
            }, 2000);
        }
    }
});

const handleBtnClose = () => {
    settings.value = false;
};
</script>

<template>
    <div
        class="card-common items-start w-[90%] md:w-[20%] shadow-xl text-bta-light dark:text-bta-dark  bg-bta-light dark:bg-bta-dark"
    >
        <div
            class="flex justify-between items-center w-[100%] "
        >
            <h2 class="text-xl">Settings</h2>
            <button @click="handleBtnClose" class="rounded-full p-2 bg-bta-elevated-light/10 dark:bg-bta-elevated-dark/10">
                <IconsClose
                    class="fill-bta-light dark:fill-bta-dark"
                    :size="{ w: '24px', h: '24px' }"
                />
            </button>
        </div>

        <div
            class="flex flex-col justify-center items-start gap-4 w-full "
        >
            <div
                class="flex flex-row justify-start items-center gap-2 border-b-2 border-b-black/10 dark:border-b-white/10 w-full"
            >
                <!-- <IconsAccount :active="true" :size="{ w: '24px', h: '24px' }" /> -->
                <p class="">Profile</p>
            </div>
            <div
                class="flex flex-col justify-center items-start gap-2 line-clamp-1 whitespace-nowrap text-lg"
                v-if="currentUser"
            >
                <p>Name: {{ currentUser?.displayName }}</p>
                <p>Email: {{ currentUser?.email }}</p>
                <p>Saved BusStops: {{ savedStops }}</p>
            </div>
            <p v-if="!currentUser">Not Logged In</p>
            <button class="self-end rounded-md text-bta-light  dark:text-bta-dark p-2 bg-bta-elevated-light/10 dark:bg-bta-elevated-dark/10" @click="handleAuth">
                {{ authBtnText }}
            </button>
            <p v-if="authMessage">Loggin Out...</p>
        </div>
        <div
            class="flex flex-col justify-center items-start gap-4 w-full "
        >
            <div
                class="flex flex-row justify-start items-center gap-2 border-b-2 border-b-black/10 dark:border-b-white/10 w-full"
            >
                <p>Other</p>
            </div>
            <div class="flex flex-row gap-2 w-full text-lg">
                <p>Dark Mode</p>
                <input
                    type="radio"
                    id="system"
                    value="system"
                    v-model="mode.preference"
                />
                <label for="auto">Auto</label>

                <input
                    type="radio"
                    id="light"
                    value="light"
                    v-model="mode.preference"
                />
                <label for="light">Light</label>
                <input
                    type="radio"
                    id="dark"
                    value="dark"
                    v-model="mode.preference"
                />
                <label for="dark">Dark</label>
            </div>
        </div>
    </div>
</template>
