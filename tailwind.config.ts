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
        navy: {
          DEFAULT: "#101B35", // Primary midnight navy
          deep: "#0B1530",    // Deep navy
          light: "#1C2D54",
          surface: "#152243",
        },
        ivory: {
          DEFAULT: "#FAF9F6", // Warm ivory
          light: "#FCFBF9",
          dark: "#F4F1EB",
        },
        gold: {
          DEFAULT: "#B99A59", // Champagne gold
          hover: "#A3864A",
          light: "#D8C59C",
          muted: "#8C733F",
        },
        beige: {
          DEFAULT: "#EAE4D9", // Soft beige
          subtle: "#F5F2EB",
          border: "#E9E5DE",  // Border
        },
        charcoal: {
          DEFAULT: "#77736D", // Warm grey
          dark: "#2A2825",
          muted: "#9C9790",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Manrope'", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        luxury: "0.2em",
        subtle: "0.08em",
      },
    },
  },
  plugins: [],
};

export default config;
