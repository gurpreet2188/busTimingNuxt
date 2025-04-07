<script setup lang="ts">
import { SIGNIN } from "#imports";
import type { ConcreteComponent } from "vue";
import Btn from "~/components/base/btn.vue";

const showLoading = ref(true);
const skipWelcome = useState("skipWelcome");
const showNav: Ref<boolean> = useState("showNav");
const iconAccount = resolveComponent("IconsAccount");
const iconLocation = resolveComponent("IconsLocation");
onMounted(async () => {
    showNav.value = false;
    if (localStorage.getItem("skipWelcome")) {
        skipWelcome.value = true;
        return navigateTo(LOCATION_BASED);
    }
    showLoading.value = false;
});

const loginBtnClickHandle = async () => {
    await navigateTo(SIGNIN);
};
const locateBusStopClickHandle = async () => {
    await navigateTo(LOCATION_BASED);
    skipWelcome.value = true;
    localStorage.setItem("skipWelcome", JSON.stringify(true));
};
</script>

<template>
    <LoadingPage v-if="showLoading" :showBarOnly="true" :location="false" />
    <div
        v-else
        class="flex flex-col justify-center items-center gap-[2rem] w-[100%] text-bta-light dark:text-bta-dark h-screen"
    >
        <IconsBus
            class="fill-bta-light dark:fill-bta-dark"
            :size="{ w: '128px', h: '128px' }"
        />
        <div
            class="flex flex-col justify-center items-center gap-8 rounded-md p-4 w-[100%]"
        >
            <p class="text-center text-lg">
                Locate nearest Bus Stops and get real-time Bus arrival timings
                in Singapore.
            </p>

            <div class="flex flex-col justify-center items-center gap-[0.5rem]">
                <Btn
                    btn-text="Login / Register"
                    label="Register or Sign into existing account."
                    :with-icon="iconAccount as ConcreteComponent"
                    :handle-click="loginBtnClickHandle"
                />
                <p class="inline-block text-center text-lg">
                    Sync your
                    <span class="inline-block"
                        ><IconsFavs
                            class="fill-bta-light dark:fill-bta-dark"
                            :size="{ w: '24px', h: '24px' }"
                    /></span>
                    Bus Stops across devices.
                </p>
            </div>
            <p class="text-lg">Or</p>
            <Btn
                btn-text="Locate Nearest Bus Stops"
                label="Skip Signing in  and locate Nearest Bus Stops."
                :with-icon="iconLocation as ConcreteComponent"
                :handle-click="locateBusStopClickHandle"
            />
        </div>
    </div>
</template>
