<script setup lang="ts"></script>
<template>
    <span
        class="loader border-[4px] border-bta-light/10 border-t-bta-light dark:border-t-bta-dark dark:border-bta-dark/10"
    ></span>
</template>

<style scoped>
.loader {
    /* border: 4px solid #f3f3f3; */
    /* border-top: 4px solid; */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
