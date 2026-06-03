import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Primary — warm tomato red (produce, energy) */
        brand: {
          50: "#FFF5F3",
          100: "#FFE8E3",
          200: "#FFCEC4",
          300: "#FFA899",
          400: "#F87562",
          500: "#E84840",
          600: "#D63B32",
          700: "#B52E27",
          800: "#962822",
          900: "#7C2520",
          950: "#43100D",
        },
        sunflower: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F5A623",
          600: "#D97706",
          700: "#B45309",
        },
        tomato: {
          50: "#FFF5F3",
          100: "#FFE8E3",
          200: "#FFCEC4",
          300: "#FFA899",
          400: "#F87562",
          500: "#E84840",
          600: "#D63B32",
          700: "#B52E27",
        },
        lavender: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
        blossom: {
          50: "#FDF2F8",
          100: "#FCE7F3",
          200: "#FBCFE8",
          300: "#F9A8D4",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D",
        },
        sage: {
          50: "#F4F7F4",
          100: "#E5EDE5",
          200: "#CBD9CB",
          300: "#A3BDA4",
          400: "#7A9E7C",
          500: "#5C8260",
          600: "#4A6B4E",
        },
        cream: {
          50: "#FDFBF7",
          100: "#F8F4EC",
          200: "#F0E8D8",
        },
        warm: {
          50: "#FFFAF5",
          100: "#FFF5EB",
          200: "#FEECD9",
          300: "#F5DCC4",
          400: "#E8C4A8",
          500: "#C9A07A",
          600: "#A67C5B",
          700: "#7A5C44",
          800: "#5C4535",
          900: "#3D2E28",
          950: "#261C18",
        },
        earth: {
          50: "#FAF7F4",
          100: "#F3EDE6",
          200: "#E8DDD2",
          300: "#D4C4B5",
          400: "#B09E8C",
          500: "#8A7968",
          600: "#6B5D50",
          700: "#564A40",
          800: "#3D3530",
          900: "#3D2E28",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "market-gradient":
          "linear-gradient(135deg, #7C3AED 0%, #DB2777 35%, #E84840 70%, #F5A623 100%)",
        "warm-gradient":
          "linear-gradient(180deg, #F4F7F4 0%, #FDFBF7 45%, #FFF5EB 100%)",
        "hero-warm":
          "linear-gradient(to bottom, rgba(45,55,45,0.5) 0%, rgba(61,46,40,0.35) 50%, rgba(45,55,45,0.65) 100%)",
        "garden-gradient":
          "linear-gradient(135deg, #E5EDE5 0%, #F8F4EC 50%, #FFF5EB 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
