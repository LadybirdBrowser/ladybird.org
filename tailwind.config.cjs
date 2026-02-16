/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "slate-blue": {
          DEFAULT: "#6d98cc",
          900: "#4872a3",
          700: "#5c8ecc",
          500: "#86add9",
          300: "#a8c8ed",
          100: "#c1d9f5",
        },
        violet: {
          DEFAULT: "#8a64e5",
          900: "#6a39db",
          700: "#8257e6",
          500: "#9d7cf2",
          300: "#b496ff",
          100: "#cab5ff",
          50: "#e0d4ff",
        },
        indigo: {
          DEFAULT: "#2a1373",
          900: "#190c4a",
          700: "#260f73",
          500: "#3c28a1",
          300: "#553fc4",
          100: "#8a88eb",
        },
      },
      fontFamily: {
        sans: ['"General Sans"', "system-ui", "-apple-system", "sans-serif"],
        mono: [
          '"Berkeley Mono"',
          '"SF Mono"',
          '"Fira Code"',
          '"JetBrains Mono"',
          "ui-monospace",
          "monospace",
        ],
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.7s ease forwards",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
