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
          bg: '#141414',
          panel: '#1a1a1a',
          border: '#2a2a2a',
          hover: '#252525',
          text: '#b4b4b4',
          'text-dim': '#808080',
          accent: '#009a9a',
          'accent-hover': '#008080',
          'shadow-dark': '#000000',
          'shadow-light': '#454545',
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
        // Embossed/recessed Flächen und Rahmen
        embossed: {
          light: '#232323',
          dark: '#101010',
        },
        recessed: {
          light: '#232323',
          dark: '#101010',
        },
        border: {
          default: '#232323',
          strong: '#353535',
        },
      },
      boxShadow: {
        'neo-recessed': 'inset 2px 2px 4px #000, inset -2px -2px 4px #353535',
        'neo-embossed': '-2px -2px 4px #232323, 2px 2px 4px #101010',
        'neo-embossed-strong': '-2px -2px 8px #232323, 2px 2px 8px #101010',
        'neo-recessed-strong': 'inset 2px 2px 8px #000, inset -2px -2px 8px #353535',
      },
      borderRadius: {
        'neo-pill': '9999px',
        'neo-rect': '12px',
      },
      borderWidth: {
        'neo': '2px',
        'neo-strong': '3px',
      },
    },
  },
  plugins: [],
};
