<script setup lang="ts">
import type { Ref } from "vue";
import BottomNav from "./components/bottomNav.vue";
const router = useRouter();
const showNav: Ref<boolean> = useState("showNav", () => false);
const skipWelcome: Ref<boolean> = useState("skipWelcome", () => false);
const settings: Ref<boolean> = useState("settings", () => false);
const darkTheme: Ref<boolean> = useState("darkTheme", () => false);
const windowBlur: Ref<boolean> = useState("windowBlur", () => false);
const bodyOverFlow: Ref<string> = ref("overflow:auto");
const colorMode = useColorMode();
const title: Ref<string> = useState("title", () => "");

useHead({
    title: "Bus Timing",
    meta: [
        {
            name: "theme-color",
            content: darkTheme ? "#0d1b2a" : "#ffe5d9",
            media: "(prefers-color-scheme: light)",
        },
        { name: "description", content: "Get Realtime Singapore Bus Timings." },
    ],
    bodyAttrs: {
        class: "min-h-screen",
        style: bodyOverFlow,
    },
    htmlAttrs: {
        class: "min-h-screen bg-bta-light dark:bg-bta-dark",
        lang: "en-US",
    },
});

onMounted(async () => {
    skipWelcome.value = JSON.parse(localStorage.getItem("skipWelcome")!!);
    router.afterEach(async (e) => {
        if (skipWelcome.value) {
            if (e.fullPath === "/") {
                router.go(-1);
            }
        }
    });

    watch(
        colorMode,
        () => {
            if (colorMode.preference === "system") {
                darkTheme.value = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                ).matches;
            } else {
                darkTheme.value = colorMode.preference === "dark";
            }
        },
        { deep: true },
    );

    darkTheme.value = window.matchMedia("(prefers-color-scheme: dark)").matches;

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
            darkTheme.value = e.matches;
        });

    window.addEventListener("blur", (e) => {
        windowBlur.value = true;
    });

    window.addEventListener("focus", (e) => {
        windowBlur.value = false;
    });
});

watch(settings, () => {
    if (settings.value) {
        bodyOverFlow.value = "overflow:hidden";
    } else {
        bodyOverFlow.value = "overflow:auto";
    }
});
</script>

<template>
    <div
        class="relative flex flex-col lg:w-[40rem] md:w-[50rem] h-screen justify-start items-center gap-[1rem] w-[100%] px-4 pb-[4rem]"
    >
        <Header v-if="showNav" :title="title" />
        <NuxtPage />

        <BottomNav
            :class="`fixed bottom-0 top-auto w-[100%] lg:w-[20%] lg:mb-2`"
            v-if="showNav"
        />
    </div>
    <div
        v-if="settings"
        class="fixed flex justify-center items-center z-20 h-screen bg-black/50 w-[100%]"
    >
        <Settings />
    </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.show-left {
    transform: translateX(52%);
}

.hide-left {
    transform: translateX(-54%);
    opacity: 0;
}

.hide-right {
    transform: translateX(100%);
    opacity: 0;
}

.show-right {
    transform: translateX(-52%);
}

.fly-in-enter-active {
    transform: translateY(0%);
    opacity: 1;
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.fly-in-leave-active {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.fly-in-enter-from {
    transform: translateY(60%);
    opacity: 0;
}

.fly-in-leave-to {
    opacity: 0;
    transform: translateY(40%);
}
</style>
