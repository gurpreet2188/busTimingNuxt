/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.{vue,js,css}",
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "./helper/*.{js,ts}",
  ],
  theme: {
    extend: {
      fill: {
        bta: {
          light: "#5f7470",
          dark: "#508991",
          inverted: "#e0e2db",
          "inverted-white": "#ffffff",
          "inverted-black": "#000000",
        },
      },
      stroke: {
        bta: {
          light: "#5f7470",
          dark: "#508991",
          inverted: "#e0e2db",
          "inverted-white": "#ffffff",
          "inverted-black": "#000000",
        },
      },
      backgroundColor: {
        bta: { light: "#e0e2db", dark: "#0d1b2a" },
        "bta-elevated": { light: "#5f7470", dark: "#172a3a" },
      },
      textColor: {
        bta: { light: "#5f7470", dark: "#508991", inverted: "#e0e2db" },
      },
    },
  },
  plugins: [],
  safelist: [
    { pattern: /fill-bta(light|dark|inverted|inverted-white|inverted-black)/ },
    {
      pattern: /stroke-bta(light|dark|inverted|inverted-white|inverted-black)/,
    },
  ],
};
