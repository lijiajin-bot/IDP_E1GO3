/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        utm: {
          maroon: '#800020',
          'maroon-dark': '#5C0017',
          'maroon-light': '#A0303A',
          gold: '#D4AF37',
          'gold-light': '#E8CC6E',
          'gold-dark': '#B8960C',
        },
      },
    },
  },
  plugins: [],
};
