/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {},
    },
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
