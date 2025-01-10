<script setup lang="ts">
import { getAuth, signOut } from "firebase/auth";
import type { COMPONENT_STATE } from "../types/components";
import type { Root as BUS_INFO_TYPE } from "~/types/bus";
import changeComponentState from "~/helper/componentsState";
import { ComponentsStateKeys } from "../types/components";
const settings: Ref<boolean> = useState("settings");
const authBtnText: Ref<string> = ref("Logout");
const darkTheme = useState("darkTheme");
const darkModeState: Ref<string> = useState("darkModeState", () => "auto");
const currentUser = useCurrentUser();
const authMessage: Ref<boolean> = ref(false);
const componentsState: Ref<COMPONENT_STATE> = useState("component_state");
const favsStops: Ref<BUS_INFO_TYPE[] | []> = useState("favsStops");
const mode = useColorMode();
const handleAuth = () => {
    if (currentUser.value?.uid) {
        signOut(getAuth())
            .then(() => {
                console.log("signed out");
            })
            .catch((err) => console.error(err));
        authMessage.value = false;
        settings.value = false;
        componentsState.value = changeComponentState(
            ComponentsStateKeys.WELCOME,
        );
    } else {
        componentsState.value = changeComponentState(ComponentsStateKeys.LOGIN);
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
                <p>Saved BusStops: {{ favsStops.length }}</p>
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
                <label for="tlight">Light</label>
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
