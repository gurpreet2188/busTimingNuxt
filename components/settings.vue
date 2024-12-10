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
        class="card-common items-start w-[90%] md:w-[20%] shadow-xl bg-bta-elevated-light dark:bg-bta-elevated-dark"
    >
        <div
            class="flex justify-between items-center w-[100%] text-bta-inverted dark:text-bta-dark"
        >
            <h2 class="text-2xl tracking-wider">Settings</h2>
            <button @click="handleBtnClose">
                <IconsClose
                    :colorClass="'fill-bta-inverted stroke-bta-inverted dark:fill-bta-dark dark:stroke-bta-dark'"
                    :active="true"
                    :size="{ w: '20px', h: '20px' }"
                />
            </button>
        </div>

        <div
            class="flex flex-col justify-center items-start gap-4 w-full text-bta-inverted dark:text-bta-dark"
        >
            <div
                class="flex flex-row justify-start items-center gap-2 border-b-2 border-b-black/10 dark:border-b-white/10 w-full"
            >
                <!-- <IconsAccount :active="true" :size="{ w: '24px', h: '24px' }" /> -->
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
            class="flex flex-col justify-center items-start gap-4 w-full text-bta-inverted dark:text-bta-dark"
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
