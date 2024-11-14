<script setup lang="ts">
import { getAuth, signOut } from "firebase/auth";
import type { COMPONENT_STATE } from "../types/components";
import changeComponentState from "~/helper/componentsState";
import { ComponentsStateKeys } from "../types/components";

const transitionLoad: Ref<boolean> = useState("transitionLoad");
const settings: Ref<boolean> = useState("settings");
const authBtnText: Ref<string> = ref("Logout");
const darkTheme = useState("darkTheme");
const currentUser = useCurrentUser();
const authMessage: Ref<boolean> = ref(false);
const componentsState: Ref<COMPONENT_STATE> = useState("component_state");

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
        class="card-common items-start w-[90%] md:w-[20%] shadow-xl bg-[#ffcdb2] dark:bg-[#0d1b2a]"
    >
        <div
            class="flex justify-between items-center w-[100%] text-[#6d6875] dark:text-[#ffcdb2]"
        >
            <h2 class="text-xl font-light tracking-wider">Settings</h2>
            <button @click="handleBtnClose">
                <IconsClose
                    :color="darkTheme ? '#ffcdb2' : '#6d6875'"
                    :size="{ w: '16px', h: '16px' }"
                />
            </button>
        </div>
        <div>
            <div>
                <button @click="handleAuth" class="btn-common">
                    {{ authBtnText }}
                </button>
                <p v-if="authMessage">Loggin Out...</p>
            </div>
        </div>
    </div>
</template>
