/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7c3aed",   // Indigo
          light: "#a78bfa",
          dark: "#5b21b6",
        },
        accent: {
          DEFAULT: "#c4b5fd",
        },
        background: {
          dark: "#0f0f1a",
          mid: "#141428",
        }
      }
    },
  },
  plugins: [],
};