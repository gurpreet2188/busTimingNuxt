<script setup lang="ts">
import { SIGNIN } from "#imports";
import type { ConcreteComponent } from "vue";
import LoadingSpinner from "~/components/loadingSpinner.vue";

const showNav: Ref<boolean> = useState("showNav");
const route = useRouter().currentRoute.value;
const mode = useColorMode();
const showMiscSettings: Ref<boolean> = ref(false);
const user = useSupabaseUser();
const avatar: Ref<null | string> = ref(null);
const loading: Ref<boolean> = ref(false);
const supabase = useSupabaseClient();
const errorMsg: Ref<string> = ref("");
const iconClose = resolveComponent("IconsClose");
const savedStopsCount: Ref<number> = ref(0);
const svgIconClass =
    "fill-bta-on-secondary-light dark:fill-bta-dark transition-all duration-300 ease-linear";

onBeforeMount(() => {
    showNav.value = false;
    if (route.query.rd) {
        showMiscSettings.value = false;
        window.setTimeout(async () => await navigateTo(LOCATION_BASED), 2000);
    } else {
        showMiscSettings.value = true;
    }
});

onMounted(async () => {
    // error.value = !user.value && true;
    if (!user.value) {
        await navigateTo(SIGNIN);
    }

    const res: { data: { avatar_url: string }; error: any } = await $fetch(
        "/api/get-user-avatar",
        {
            method: "POST",
            body: { id: user.value?.id },
        },
    );
    avatar.value = res?.data && res?.data?.avatar_url;

    savedStopsCount.value = await useCheckTotalStops(user.value!.id);
});

const handleSignOut = async () => {
    loading.value = true;
    try {
        await supabase.auth.signOut();
        await navigateTo(LOCATION_BASED);
    } catch (e) {
        errorMsg.value = e as string;
    } finally {
        loading.value = false;
    }
};

const handleCloseBtn = () => {
    const router = useRouter();
    router.back();
};
</script>

<template>
    <div
        class="relative flex flex-col justify-start items-center pt-20 gap-4 w-full h-full"
    >
        <div
            v-if="showMiscSettings"
            class="fixed top-0 flex justify-between items-center w-full p-4"
        >
            <h1
                class="text-lg font-bold text-bta-on-secondary-light dark:text-bta-on-secondary-dark mt-1"
            >
                Profile
            </h1>
            <IconButton
                :handle-click="handleCloseBtn"
                :icon="iconClose as ConcreteComponent"
                :size="{ w: '24px', h: '24px' }"
                :custom-class="svgIconClass"
            />
        </div>

        <div
            class="flex flex-col justify-center items-center gap-2 p-4 bg-bta-elevated-light/10 w-full"
        >
            <div v-if="avatar" class="rounded-full overflow-hidden w-[136px]">
                <img :src="avatar" width="136px" />
            </div>
            <IconsAccount
                v-else
                :size="{ w: '136px', h: '136px' }"
                class="fill-bta-light dark:fill-bta-dark"
            />
            <p class="text-lg font-bold text-bta-light dark:text-bta-dark">
                {{ user?.email }}
            </p>
        </div>
        <div
            class="flex flex-col justify-center items-start self-start gap-2 w-full dark:text-bta-dark"
        >
            <p>Saved Stops: {{ savedStopsCount }}</p>
            <p>Last Updated: {{}}</p>
            <button
                v-if="showMiscSettings"
                @click="handleSignOut"
                class="p-2 bg-bta-elevated-light/10 self-end text-lg text-bta-light dark:text-bta-dark rounded-md"
            >
                Logout
            </button>
        </div>
        <div v-if="showMiscSettings" class="w-full">
            <p class="self-start text-sm">Customize Dark Mode</p>
            <DarkmodeControl />
        </div>

        <div
            v-else
            class="flex flex-col justify-center items-center gap-2 w-full mt-40"
        >
            <h2 class="text-xl text-bta-light dark:text-bta-dark">
                Sign In Sucessful
            </h2>
            <LoadingSpinner />
        </div>
    </div>
</template>
