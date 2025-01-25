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
    "nuxt-vuefire",
    "@nuxtjs/color-mode",
  ],
  routeRules: {
    "/": { prerender: true },
  },
  nuxtApiShield: {
    limit: { max: 250, duration: 60, ban: 10 },
  },
  // pwa: {},
  ssr: false,

  vuefire: {
    auth: {
      enabled: true,
      sesssionCookie: true,
    },
    config: {
      apiKey: process.env.API_KEY_FIREBASE,
      authDomain: process.env.APP_NAME_FIREBASE + ".firebaseapp.com",
      projectId: process.env.APP_NAME_FIREBASE,
      storageBucket: process.env.APP_NAME_FIREBASE + ".appspot.com",
      messagingSenderId: process.env.MESSAGE_ID_FIREBASE,
      appId: process.env.APP_ID_FIREBASE,
      measurementId: process.env.MEASUREMENT_ID_FIREBASE,
    },
  },

  tailwindcss: { cssPath: "~/assets/css/tailwind.css" },
  runtimeConfig: {
    public: {
      GMAP_KEY: process.env.GMAP_KEY,
    },
  },
  compatibilityDate: "2024-11-08",
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
});
