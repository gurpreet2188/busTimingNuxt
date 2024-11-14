// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "nuxt-vuefire",
    "@pinia/nuxt",
  ],
  ssr: false,

  vuefire: {
    auth: true,
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

  // build: {
  //   // @ts-ignore
  //   postcss: {
  //     postcssOptions: require('./postcss.config.js'),
  //   },
  // },
  // experimental: {
  //   inlineSSRStyles: false
  // },

  compatibilityDate: "2024-11-08",
});
