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
    colors: {
      bta: {
        50: "#F1F7F9",
        100: "#E3EEF3",
        200: "#CADFE8",
        300: "#ADCEDB",
        400: "#95BFD0",
        500: "#78AFC4",
        600: "#4E95B1",
        700: "#396E83",
        800: "#274B59",
        900: "#13242B",
        950: "#091215",
      },
      transparent: "transparent",
    },
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
        bta: {
          light: "#ffffff",
          dark: "#212529",
          card: { light: "#E2BFD9", dark: "#574964" },
        },
        "bta-elevated": { light: "#5f7470", dark: "#343a40" },
        "bta-loading-bar": { light: "#5f7470", dark: "#508991" },
        "bta-secondary": { light: "#d2d4c8", dark: "#495057" },
      },
      textColor: {
        bta: {
          light: "#5f7470",
          dark: "#ced4da",
          inverted: "#e0e2db",
          card: { light: "#674188", dark: "#FFDAB3" },
        },
        "bta-on-secondary": { light: "#5f7470", dark: "#dee2e6" },
      },
      borderColor: {
        bta: { light: "#5f7470", dark: "#ced4da" },
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("tailwindcss-fluid-type")],
  safelist: ["animate-spin", "scale-150"],
};
