/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './frontend/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        next: {
          bg: '#0a0a0a',
          panel: '#1a1a1a',
          border: '#2a2a2a',
          hover: '#252525',
          text: '#d0d0d0',
          'text-dim': '#808080',
          accent: '#009a9a',
          'accent-hover': '#008080',
        },
      },
    },
  },
  plugins: [],
};
