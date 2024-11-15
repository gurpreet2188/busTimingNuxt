<script setup lang="ts">
const darkTheme = useState("darkTheme");
const size = { h: "24px", w: "24px" };

const filterFavs: Ref<boolean> = useState("filterFavs");

const clickHandle = (val: boolean) => {
    return (filterFavs.value = val);
};
</script>

<template>
    <div
        class="flex justify-center items-center w-[100%] h-[100%] lg:shadow-lg lg:rounded-lg bg-[#f8edeb]/50 dark:bg-[#0d1b2a]/50 backdrop-blur-md"
    >
        <div class="flex justify-center items-center w-[50%]">
            <button
                @click="
                    () => {
                        clickHandle(false);
                    }
                "
            >
                <IconsLocation
                    :color="darkTheme ? '#ffcdb2' : '#7f5539'"
                    :size="size"
                    :active="!filterFavs"
                />
            </button>
        </div>
        <div class="flex justify-center items-center w-[50%]">
            <button
                @click="
                    () => {
                        clickHandle(true);
                    }
                "
            >
                <IconsFavs
                    :color="darkTheme ? '#ffcdb2' : '#7f5539'"
                    :size="size"
                    :active="filterFavs"
                />
            </button>
        </div>
    </div>
</template>
