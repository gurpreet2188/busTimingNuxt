<script setup lang="ts">
import { PROFILE } from "#imports";
import type { ConcreteComponent } from "vue";
defineProps<{ title: string }>();
const user = useSupabaseUser();
const avatar: Ref<string | null> = ref(null);
const settings = useState("settings");
const refreshData = useState("refreshData");
const animateRefresh: Ref<boolean> = useState("animateRefresh");
const expandedNavComponent: Ref<string | null> = useState(
    "expandedNavComponent",
    () => null,
);
const expandedNavProps: Ref<{}> = useState("expandedNavProps", () => {
    return {};
});
const svgIconClass =
    "fill-bta-900 dark:fill-bta-50 transition-all duration-300 ease-linear";

const iconRefresh = resolveComponent("IconsRefresh");
const iconCog = resolveComponent("IconsCog");

const addShadow: Ref<string> = ref("");

onMounted(async () => {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 10 && addShadow.value.length === 0) {
            addShadow.value = "shadow-md";
        } else if (addShadow.value.length > 0 && window.scrollY === 0) {
            addShadow.value = "";
        }
    });

    if (user.value) {
        const res: { data: { avatar_url: string }; error: any } = await $fetch(
            "/api/get-user-avatar",
            { method: "POST", body: { id: user.value.id } },
        );
        avatar.value = res.data && res.data.avatar_url;
    }
});

const settingsBtnHandle = async () => {
    if (user.value) {
        await navigateTo(PROFILE);
    } else {
        settings.value = !settings.value;
    }
};
</script>

<template>
    <div
        :class="addShadow"
        class="fixed flex flex-col justify-between items-center gap-4 p-4 w-full bottom-auto z-10 lg:w-[40%] md:w-[60%] bg-bta-50 dark:bg-bta-900"
    >
        <div class="flex flex-row justify-between items-center w-full">
            <h1
                class="self-start text-2xl font-extrabold line-clamp-1 text-bta-900 dark:text-bta-50 mt-1"
            >
                {{ title }}
            </h1>

            <div class="flex flex-row justify-center items-center gap-4">
                <IconButton
                    :class="animateRefresh ? 'animate-spin' : ''"
                    :icon="iconRefresh as ConcreteComponent"
                    :size="{ w: '24px', h: '24px' }"
                    :iconClass="svgIconClass"
                    :handle-click="() => (refreshData = !refreshData)"
                />
                <button
                    @click="settingsBtnHandle"
                    v-if="user"
                    class="rounded-full overflow-hidden"
                >
                    <img :src="avatar!" width="36px" />
                </button>
                <IconButton
                    v-if="!user"
                    :icon="iconCog as ConcreteComponent"
                    :size="{ w: '24px', h: '24px' }"
                    :iconClass="svgIconClass"
                    :handle-click="settingsBtnHandle"
                />
            </div>
        </div>
        <Transition>
            <component :is="expandedNavComponent!" v-bind="expandedNavProps" />
        </Transition>
    </div>
</template>
