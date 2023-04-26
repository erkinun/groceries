/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFD898',
        primaryBold: '#A36A00',
        secondary: '#5865f2',
        cream: '#F9F6F0',
        rosey: '#FEE7E6',
      },
    },
  },
  plugins: [],
};
