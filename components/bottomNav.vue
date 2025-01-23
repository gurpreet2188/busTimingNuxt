<script setup lang="ts">
import { navigateTo } from "#build/imports";
import { LOCATION_BASED, SAVED, SEARCH } from "#build/imports";
const bottomNavRoute: Ref<string> = useState("bottomNavRoute");
const size = { h: "24px", w: "24px" };
</script>

<template>
    <div
        class="flex justify-center items-center w-full py-4 lg:p-2 rounded-md border-t-[1px] border-bta-light/50 dark:border-bta-dark/50 lg:shadow-lg lg:rounded-lg bg-bta-light dark:bg-bta-dark"
    >
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    bottomNavRoute === (LOCATION_BASED as string)
                        ? 'bg-bta-elevated-light/30 dark:bg-bta-elevated-dark/30'
                        : ''
                "
                @click="
                    async () => {
                        await navigateTo(LOCATION_BASED);
                    }
                "
            >
                <IconsLocation
                    :size="size"
                    class="fill-bta-light dark:fill-bta-dark"
                />
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    bottomNavRoute === SAVED
                        ? 'bg-bta-elevated-light/30 dark:bg-bta-elevated-dark/30'
                        : ''
                "
                @click="
                    async () => {
                        await navigateTo(SAVED);
                    }
                "
            >
                <IconsFavs
                    :size="size"
                    class="fill-bta-light dark:fill-bta-dark"
                />
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    bottomNavRoute === SEARCH
                        ? 'bg-bta-elevated-light/30 dark:bg-bta-elevated-dark/30'
                        : ''
                "
                @click="
                    async () => {
                        await navigateTo(SEARCH);
                    }
                "
            >
                <IconsSearch
                    :size="size"
                    class="fill-bta-light dark:fill-bta-dark"
                />
            </button>
        </div>
    </div>
</template>
