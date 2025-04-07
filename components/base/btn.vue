<script setup lang="ts">
import type { ConcreteComponent } from "vue";

const props = defineProps<{
    btnText: string;
    label: string;
    handleClick: () => void;
    elevated?: boolean;
    btnClass?: string;
    withIcon?: ConcreteComponent;
    iconSize?: { w: string; h: string };
}>();
const btnCss = " p-2 rounded-md font-bold text-bta-light dark:text-bta-dark ";
const bg = props.btnClass
    ? props.btnClass
    : props.elevated
      ? " bg-bta-secondary-light/40 dark:bg-bta-elevated-dark/40 "
      : " bg-bta-secondary-light/20 dark:bg-bta-elevated-dark/20 ";
</script>
<template>
    <button
        v-if="withIcon"
        :aria-label="label"
        @click="handleClick"
        @keyup.enter="handleClick"
        :class="'flex justify-center items-center gap-1 ' + btnCss + bg!"
    >
        <component
            :is="withIcon!"
            class="fill-bta-light dark:fill-bta-dark"
            :size="iconSize ? iconSize : { w: '22px', h: '22px' }"
        />
        <p class="text-lg font-bold text-bta-light dark:text-bta-dark">
            {{ btnText }}
        </p>
    </button>
    <button
        v-else
        :aria-label="label"
        @click="handleClick"
        @keyup.enter="handleClick"
        :class="btnCss + bg!"
    >
        {{ btnText }}
    </button>
</template>
