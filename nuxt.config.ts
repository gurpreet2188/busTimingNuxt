// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: false },
  nitro: {
    compressPublicAssets: true,
  },
  modules: [
    "@vueuse/nuxt",
    "nuxt-api-shield",
    "nuxt-component-meta",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@nuxtjs/color-mode",
  ],
  build: {
    analyze: {},
  },
  sourcemap: {
    server: false,
    client: true,
  },
  routeRules: {
    "/": { prerender: true },
    "/auth/signin": { prerender: true },
    "/search": { prerender: true },
  },
  nuxtApiShield: {
    limit: { max: 250, duration: 60, ban: 10 },
  },
  supabase: {
    redirect: false,
  },
  ssr: false,
  tailwindcss: { cssPath: "~/assets/css/tailwind.css" },
  runtimeConfig: {
    public: {
      GMAP_KEY: process.env.GMAP_KEY,
      APP_BASE_URL: process.env.APP_BASE_URL,
    },
  },
  app: {
    pageTransition: { name: "page", mode: "default" },
  },
});
