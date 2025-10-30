
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7ff",
          100: "#e6effe",
          500: "#0c2340",
          600: "#081a30"
        }
      }
    }
  },
  plugins: []
};
