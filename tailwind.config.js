/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './frontend/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow', 'sans-serif'],
      },
      colors: {
        next: {
          bg: '#1a1a1a',
          panel: '#1a1a1a',
          border: '#2a2a2a',
          hover: '#252525',
          text: '#d0d0d0',
          'text-dim': '#808080',
          accent: '#009a9a',
          'accent-hover': '#008080',
        },
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
    },
  },
  plugins: [],
};
