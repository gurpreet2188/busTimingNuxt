// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', 'nuxt-vuefire', '@pinia/nuxt'],
  ssr: false,
  vuefire: {
    auth: true,
    config: {
      apiKey: "AIzaSyD15QaJk-eQublaTBZmeb7KpvaaGJWbUcU",
      authDomain: "sgbustiming.firebaseapp.com",
      projectId: "sgbustiming",
      storageBucket: "sgbustiming.appspot.com",
      messagingSenderId: "602919769504",
      appId: "1:602919769504:web:4f5c9991760b1e715980c5",
      measurementId: "G-HWPKSFBCDY"
    }
  },
  tailwindcss: { cssPath: '~/assets/css/tailwind.css' },
  // build: {
  //   // @ts-ignore
  //   postcss: {
  //     postcssOptions: require('./postcss.config.js'),
  //   },
  // },
  experimental: {
    inlineSSRStyles: false
  },
})
