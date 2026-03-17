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
        // 🎨 Primary - Vibrant Cyan/Turquoise (pops against charcoal)
        primary: {
          DEFAULT: "#0891b2",   // Cyan 600 - Vibrant and fresh
          light: "#06b6d4",      // Cyan 500 - Lighter for hover
          dark: "#0e7490",       // Cyan 700 - Darker for active states
        },
        // 🎨 Accent - Warm Peach/Orange for contrast
        accent: {
          DEFAULT: "#f97316",    // Orange 500 - Warm, energetic accent
          light: "#fb923c",       // Orange 400 - Lighter accent
          dark: "#ea580c",        // Orange 600 - Darker accent
        },
        // 🎨 Background - Charcoal palette
        background: {
          light: "#2d2d2d",      // Light charcoal
          mid: "#1a1a1a",         // Medium charcoal
          dark: "#0a0a0a",        // Deep charcoal (almost black)
          card: "#252525",        // Card background
        },
        // 🎨 Card surfaces - Slightly lighter than background
        surface: {
          DEFAULT: "#2a2a2a",     // Dark gray for cards
          hover: "#333333",        // Hover state
        },
        // 🎨 Text colors - Readable on dark backgrounds
        text: {
          primary: "#ffffff",      // White for main text
          secondary: "#a0a0a0",    // Light gray for secondary
          muted: "#6b6b6b",        // Medium gray for muted text
        },
        // 🎨 Border colors
        border: {
          DEFAULT: "#333333",      // Subtle borders
          light: "#404040",        // Lighter borders
        }
      },
      // Add subtle shadows for depth
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'hover': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};