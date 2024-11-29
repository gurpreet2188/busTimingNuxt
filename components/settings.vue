<script setup lang="ts">
import { getAuth, signOut } from "firebase/auth";
import type { COMPONENT_STATE } from "../types/components";
import type { Root as BUS_INFO_TYPE } from "~/types/bus";
import changeComponentState from "~/helper/componentsState";
import { ComponentsStateKeys } from "../types/components";
const transitionLoad: Ref<boolean> = useState("transitionLoad");
const settings: Ref<boolean> = useState("settings");
const authBtnText: Ref<string> = ref("Logout");
const darkTheme = useState("darkTheme");
const darkModeState: Ref<string> = useState("darkModeState", () => "auto");
const currentUser = useCurrentUser();
const authMessage: Ref<boolean> = ref(false);
const componentsState: Ref<COMPONENT_STATE> = useState("component_state");
const favsStops: Ref<BUS_INFO_TYPE[] | []> = useState("favsStops");
const mode = useColorMode({
    attribute: "theme",
    modes: { auto: "auto", dark: "dark", light: "light" },
});
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

watch(
    darkModeState,
    () => {
        if (darkModeState.value === "light") {
            darkTheme.value = false;
            mode.value = "light";
        } else if (darkModeState.value === "dark") {
            darkTheme.value = true;
            mode.value = "dark";
        }
    },
    { immediate: false, deep: true },
);
</script>

<template>
    <div
        class="card-common items-start w-[90%] md:w-[20%] shadow-xl bg-[#ffe5d9] dark:bg-[#1b263b]"
    >
        <div
            class="flex justify-between items-center w-[100%] text-[#6d6875] dark:text-[#ffcdb2]"
        >
            <h2 class="text-2xl tracking-wider">Settings</h2>
            <button @click="handleBtnClose">
                <IconsClose
                    :color="darkTheme ? '#ffcdb2' : '#6d6875'"
                    :size="{ w: '20px', h: '20px' }"
                />
            </button>
        </div>

        <div
            class="flex flex-col justify-center items-start gap-4 w-full text-[#212121] dark:text-[#f1f1f1]"
        >
            <div
                class="flex flex-row justify-start items-center gap-2 border-b-2 border-b-black/10 dark:border-b-white/10 w-full"
            >
                <IconsAccount
                    :active="true"
                    :color="darkTheme ? '#f1f1f1' : '#212121'"
                    :size="{ w: '24px', h: '24px' }"
                />
                <p class="text-lg">Profile</p>
            </div>
            <div
                class="flex flex-col justify-center items-start gap-2 line-clamp-1 whitespace-nowrap text-lg"
                v-if="currentUser"
            >
                <p class="">Name: {{ currentUser?.displayName }}</p>
                <p class="">Email: {{ currentUser?.email }}</p>
                <p>Saved BusStops: {{ favsStops.length }}</p>
            </div>
            <p v-if="!currentUser">Not Logged In</p>
            <button class="self-end btn-common" @click="handleAuth">
                {{ authBtnText }}
            </button>
            <p v-if="authMessage">Loggin Out...</p>
        </div>
        <div
            class="flex flex-col justify-center items-start gap-4 w-full text-[#212121] dark:text-[#f1f1f1]"
        >
            <div
                class="flex flex-row justify-start items-center gap-2 border-b-2 border-b-black/10 dark:border-b-white/10 w-full"
            >
                <p class="text-lg">Other</p>
            </div>
            <div class="flex flex-row gap-2 w-full">
                <p>Dark Mode</p>
                <input
                    type="radio"
                    id="auto"
                    value="auto"
                    v-model="darkModeState"
                />
                <label for="auto">Auto</label>

                <input
                    type="radio"
                    id="light"
                    value="light"
                    v-model="darkModeState"
                />
                <label for="tlight">Light</label>
                <input
                    type="radio"
                    id="dark"
                    value="dark"
                    v-model="darkModeState"
                />
                <label for="dark">Dark</label>
            </div>
        </div>
    </div>
</template>
