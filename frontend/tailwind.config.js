/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFF8FA',
        'pink-primary': '#F8BBD0',
        'pink-secondary': '#F48FB1',
        'green-accent': '#A8C5A0',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'pink-glow': '0 0 30px rgba(244, 143, 177, 0.35)',
        'soft': '0 8px 32px rgba(180, 100, 150, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  darkMode: "class",
  plugins: [require("tailwindcss-animate")],
}