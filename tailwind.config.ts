import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecf7ff",
          100: "#d8eefe",
          200: "#b0defc",
          300: "#88cdfa",
          400: "#5fbdf8",
          500: "#37acf6",
          600: "#0f9cf4",
          700: "#0c7dc3",
          800: "#095e92",
          900: "#063e62"
        }
      }
    }
  },
  plugins: []
};

export default config;
