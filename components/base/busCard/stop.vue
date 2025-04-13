<script setup lang="ts">
import type { ConcreteComponent } from "vue";
import IconButton from "../../iconButton.vue";
import Btn from "../btn.vue";
const props = defineProps<{ stopCode: string; stopName: string }>();
const stopIcon = resolveComponent("IconsBusStop") as ConcreteComponent;
const handleClick = async () => {
    await navigateTo(STOP + "/" + props.stopCode);
};
</script>
<template>
    <div class="flex flex-col justify-center items-start gap-2 w-full">
        <Btn
            class=""
            :btn-text="stopCode"
            :label="'explore bus stop ' + stopCode"
            :handle-click="handleClick"
            :elevated="true"
        />
        <!-- <IconButton
            :icon="stopIcon"
            icon-class="fill-bta-light dark:fill-bta-dark"
            :size="{ w: '20px', h: '20px' }"
            :handle-click="handleClick"
        /> -->
        <p
            class="text-ellipsis text-sm font-bold text-bta-900 dark:text-bta-dark line-clamp-1 w-full"
        >
            {{ stopName }}
        </p>
    </div>
</template>
