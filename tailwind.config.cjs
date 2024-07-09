/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    animation: {
      marquee: "marquee 15s linear infinite",
      marquee2: "marquee2 25s linear infinite",
      scroller3: "scroller3 25s linear infinite",
      "spin-slow": "spin 4s linear infinite",
      "spin-slower": "spin 6s linear infinite",
      "spin-reverse": "spin-reverse 1s linear infinite",
      "spin-reverse-slow": "spin-reverse 4s linear infinite",
      "spin-reverse-slower": "spin-reverse 6s linear infinite",
      scroller: "scroller 15s linear infinite",
      scroller2: "scroller2 20s linear infinite",
      "fade-in": "fade-in 0.5s linear forwards",
    },
    keyframes: {
      marquee: {
        "0%": { transform: "translateX(0%)" },
        "100%": { transform: "translateX(-100%)" },
      },
      marquee2: {
        "0%": { transform: "translateX(100%)" },
        "100%": { transform: "translateX(0%)" },
      },
      scroller: {
        "0%": { transform: "translateY(10em)" },
        "100%": { transform: "translateY(-14em)" },
      },
      scroller2: {
        "0%": { transform: "translateY(10em)" },
        "100%": { transform: "translateY(-14em)" },
      },
      "fade-in": {
        from: {
          opacity: 0,
        },
        to: {
          opacity: 1,
        },
      },
      scroller3: {
        "100%": {
          transform: "translateY(-50%)",
        },
      },
      "spin-reverse": {
        to: {
          transform: "rotate(-360deg)",
        },
      },
    },
    extend: {
      colors: {
        black: "#0e0e0e",
        white: "#d8e7e7",
        eagle: "#a4b3b3",
        "pop-blue": "#2541ea",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        display: ["Basement", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),

    require("@tailwindcss/forms"),
    // ...
  ],
};
