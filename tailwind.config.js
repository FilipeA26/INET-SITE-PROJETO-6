/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#03256C", deep: "#020F2E", ink: "#010818" },
        royal: "#003F99",
        electric: "#0062EC",
        forest: "#007200",
        leaf: "#38B000",
        lime: "#70E000",
      },
      fontFamily: {
        display: ['"Exo 2"', "system-ui", "sans-serif"],
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
