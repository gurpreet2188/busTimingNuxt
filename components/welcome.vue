<script setup lang="ts">
import type { COMPONENT_STATE } from "../types/components";
import { ComponentsStateKeys } from "../types/components";
import changeComponentState from "~/helper/componentsState";
const darkTheme = useState("darkTheme");
const skipWelcome = useState("skipWelcome");
const componentsState: Ref<COMPONENT_STATE> = useState("component_state");
const loginBtnClickHandle = () => {
    componentsState.value = changeComponentState(ComponentsStateKeys.LOGIN);
};

const locateBusStopClickHandle = () => {
    componentsState.value = changeComponentState(
        ComponentsStateKeys.LOCATIONLOADING,
    );
    skipWelcome.value = true;
    localStorage.setItem("skipWelcome", JSON.stringify(true));
};
</script>

<template>
    <div
        class="flex flex-col justify-center items-center gap-[2rem] w-[100%] text-bta-inverted dark:text-bta-dark h-screen"
    >
        <IconsBus
            class="fill-bta-light dark:fill-bta-dark"
            :size="{ w: '128px', h: '128px' }"
        />
        <div
            class="flex flex-col justify-center items-center gap-8 rounded-md p-4 bg-bta-elevated-light dark:bg-bta-elevated-dark w-[100%]"
        >
            <!-- info -->
            <p class="text-center text-xl">
                Locate nearest Bus Stops and get real-time Bus arrival timings
                in Singapore.
            </p>
            <!-- Account -->
            <div class="flex flex-col justify-center items-center gap-[0.5rem]">
                <button @click="loginBtnClickHandle" class="btn-common">
                    <!-- <IconsAccount
                        :color="darkTheme ? '#ffcdb2' : '#7f5539'"
                        :size="{ w: '24px', h: '24px' }"
                    /> -->
                    Login / Register
                </button>
                <p class="inline-block text-center text-lg">
                    Sync your
                    <span class="inline-block"
                        ><IconsFavs
                            class="fill-bta-inverted dark:fill-bta-dark"
                            :size="{ w: '24px', h: '24px' }"
                    /></span>
                    Bus Stops across devices.
                </p>
            </div>
            <p class="text-xl">Or</p>
            <!-- locate bus stop -->
            <button @click="locateBusStopClickHandle" class="btn-common w-auto">
                <IconsLocation
                    class="fill-bta-inverted dark:fill-bta-dark"
                    :size="{ w: '24px', h: '24px' }"
                />
                Locate Nearest Bus Stops
            </button>

            <!-- credit -->
        </div>
        <!-- LTA -->
        <!-- Github -->
    </div>
</template>
