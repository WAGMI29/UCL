/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B4513",
        background: "#FDF6EC",
        surface: "#FFFFFF",
        accent: "#DAA520",
        "text-primary": "#1A1A2E",
        "text-secondary": "#666666",
      },
    },
  },
  plugins: [],
};
