export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Montserrat", "sans-serif"],
        body: ["var(--font-body)", "Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};