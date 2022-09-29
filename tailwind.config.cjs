/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      display: ["CrickxRegular", "serif"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
