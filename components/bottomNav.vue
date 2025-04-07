<script setup lang="ts">
import { navigateTo } from "#build/imports";
import { LOCATION_BASED, SAVED, SEARCH } from "#build/imports";
const bottomNavRoute: Ref<string> = useState("bottomNavRoute");
const size = { h: "24px", w: "24px" };
</script>

<template>
    <div
        class="flex justify-center items-center w-full py-4 border-t-[1px] border-bta-500 dark:border-bta-500 lg:p-2 lg:shadow-lg lg:rounded-lg lg:border-none bg-bta-50 dark:bg-bta-900"
    >
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    bottomNavRoute === (LOCATION_BASED as string)
                        ? 'bg-bta-300 dark:bg-bta-700'
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
                    class="fill-bta-900 dark:fill-bta-50"
                />
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    bottomNavRoute === SAVED ? 'bg-bta-300 dark:bg-bta-700' : ''
                "
                @click="
                    async () => {
                        await navigateTo(SAVED);
                    }
                "
            >
                <IconsFavs :size="size" class="fill-bta-900 dark:fill-bta-50" />
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button
                class="rounded-full px-4 py-2"
                :class="
                    bottomNavRoute === SEARCH
                        ? 'bg-bta-300 dark:bg-bta-700'
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
                    class="fill-bta-900 dark:fill-bta-50"
                />
            </button>
        </div>
    </div>
</template>
