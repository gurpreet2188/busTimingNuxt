// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt',],
  tailwindcss: {cssPath: '~/assets/css/tailwind.css'},
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
