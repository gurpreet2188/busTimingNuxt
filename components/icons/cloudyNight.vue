<script setup lang="ts">
type SIZE = {
    w: string;
    h: string;
};
defineProps<{
    size: SIZE;
}>();
</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        :width="size?.w"
        :height="size?.h"
    >
        <path
            d="M6.5 19q-1.871 0-3.185-1.306Q2 16.39 2 14.517q0-1.719 1.175-3.051t2.921-1.431q.337-2.185 2.01-3.61T12 5q2.502 0 4.251 1.749T18 11v1h.616q1.436.046 2.41 1.055T22 15.5q0 1.471-1.014 2.486Q19.97 19 18.5 19zm0-1h12q1.05 0 1.775-.725T21 15.5t-.725-1.775T18.5 13H17v-2q0-2.075-1.463-3.538T12 6T8.463 7.463T7 11h-.5q-1.45 0-2.475 1.025T3 14.5t1.025 2.475T6.5 18m5.5-6"
        />
    </svg>
</template>
