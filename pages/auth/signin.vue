<script setup lang="ts">
import { PROFILE } from "#imports";
import type LoadingSpinner from "~/components/loadingSpinner.vue";

const loading: Ref<boolean> = ref(false);
const showNav: Ref<boolean> = useState("showNav");
const errorMsg: Ref<string | null> = ref(null);
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const url = useRuntimeConfig();
onBeforeMount(() => {
    showNav.value = false;
});

onMounted(async () => {
    if (user.value?.id) {
        await navigateTo(PROFILE);
    }
});

const handleSignIn = async () => {
    loading.value = true;

    if (!url.public.APP_BASE_URL) {
        return;
    }
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: url.public.APP_BASE_URL + PROFILE + "?rd=true",
            },
        });

        if (error) {
            errorMsg.value = error.message;
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const cancelHandle = async () => {
    await navigateTo(HOME);
};
</script>

<template>
    <div
        class="flex flex-col justify-center items-center gap-4 pt-10 w-full h-full"
    >
        <LoadingSpinner v-if="loading" />
        <IconsAccount
            :size="{ w: '128px', h: '128px' }"
            class="fill-bta-light dark:fill-bta-dark"
        />
        <div
            class="flex flex-col justify-center items-center gap-4 rounded-md p-4 py-8"
        >
            <button
                @click="handleSignIn"
                class="flex flex-row justify-center items-center gap-2 text-xl rounded-md bg-white text-black p-2"
            >
                <IconsGoogle /> <span>Login/Register</span>
            </button>
            <button
                @click="cancelHandle"
                class="p-2 text-xl text-bta-light dark:text-bta-dark"
            >
                Cancel
            </button>
            <p v-if="errorMsg">{{ errorMsg }}</p>
        </div>
    </div>
</template>
