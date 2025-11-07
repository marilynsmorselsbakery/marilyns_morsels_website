/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        morselCream: "#FFF7ED",
        morselBrown: "#3F2A1C",
        morselGold: "#D79B4E"
      },
      fontFamily: {
        display: ["system-ui", "sans-serif"],
        body: ["system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

