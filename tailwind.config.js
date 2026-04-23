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
        morselGold: "#D79B4E",
        morselGoldDark: "#8B5A15", // WCAG-AA-safe gold — use for text-on-cream + as bg for white text
        morselCocoa: "#2C1810", // Rich cocoa/espresso for buttons & headings
        morselGoldLight: "#E8B875", // Lighter gold for gradients
      },
      fontFamily: {
        // next/font CSS variables — set in app/layout.tsx
        body: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        'button': '0 2px 8px rgba(63, 42, 28, 0.2)',
        'button-hover': '0 4px 12px rgba(63, 42, 28, 0.3)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
    }
  },
  plugins: []
};

