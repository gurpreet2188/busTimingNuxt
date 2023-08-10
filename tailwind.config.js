/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './assets/**/*.{vue,js,css}',
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
   './helper/*.{js,ts}'
  ],
  theme: {
    extend: {
      gridTemplateColumns:{
        'bus-info': '1fr 3fr'
      }
    }
  },
  plugins: []
}
