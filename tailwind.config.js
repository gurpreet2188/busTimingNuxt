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
          dark: "#ced4da",
          inverted: "#e0e2db",
          "inverted-white": "#ffffff",
          "inverted-black": "#000000",
        },
        "bta-on-secondary": {
          light: "#5f7470",
          dark: "#ee2e6",
        },
      },
      stroke: {
        bta: {
          light: "#5f7470",
          dark: "#ced4da",
          inverted: "#e0e2db",
          "inverted-white": "#ffffff",
          "inverted-black": "#000000",
        },
        "bta-on-secondary": {
          light: "#5f7470",
          dark: "#ee2e6",
        },
      },
      backgroundColor: {
        bta: { light: "#e0e2db", dark: "#212529" },
        "bta-elevated": { light: "#5f7470", dark: "#343a40" },
        "bta-loading-bar": { light: "#5f7470", dark: "#508991" },
        "bta-secondary": { light: "#d2d4c8", dark: "#495057" },
      },
      textColor: {
        bta: { light: "#5f7470", dark: "#ced4da", inverted: "#e0e2db" },
        "bta-on-secondary": { light: "#5f7470", dark: "#dee2e6" },
      },
      borderColor: {
        bta: { light: "#5f7470", dark: "#495057" },
      },
    },
  },
  plugins: [],
  safelist: ["animate-spin", "scale-150"],
};
