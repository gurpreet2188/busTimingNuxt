<script setup lang="ts">
import { SIGNIN } from "#imports";

const settings: Ref<boolean> = useState("settings");
const mode = useColorMode();

const handleBtnClose = () => {
    settings.value = false;
};

const handleAuthBtn = async () => {
    settings.value = false;
    setTimeout(async () => {
        await navigateTo(SIGNIN);
    }, 500);
};
</script>

<template>
    <div
        class="card-common items-start w-[90%] md:w-[20%] shadow-xl text-bta-light dark:text-bta-dark bg-bta-light dark:bg-bta-dark"
    >
        <div class="flex justify-between items-center w-[100%]">
            <h2 class="text-xl">Settings</h2>
            <button
                @click="handleBtnClose"
                class="rounded-full p-2 bg-bta-elevated-light/10 dark:bg-bta-elevated-dark/10"
            >
                <IconsClose
                    class="fill-bta-light dark:fill-bta-dark"
                    :size="{ w: '24px', h: '24px' }"
                />
            </button>
        </div>

        <div class="flex flex-col justify-center items-start gap-2 w-full">
            <p class="self-start text-sm">Customize Dark Mode</p>
            <DarkmodeControl />
        </div>
        <div
            class="self-start flex flex-col justify-center items-start gap-2 w-full"
        >
            <p>Sync your saved stops across devices</p>
            <button
                @click="handleAuthBtn"
                class="text-lg bg-bta-elevated-light/10 p-2"
            >
                Sign In/Register
            </button>
        </div>
    </div>
</template>
