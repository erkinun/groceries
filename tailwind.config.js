/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        negative: 'var(--color-negative)',
        positive: 'var(--color-positive)',
        cream: 'var(--color-cream)',
        rosey: 'var(--color-rosey)',
        'primary-background': 'var(--background-primary)',
        primaryBold: 'var(--color-primary-bold)',
        'sec-background': 'var(--background-sec)',
        contrast: 'var(--color-contrast)',
        'primary-text': 'var(--color-text-primary)',
      },
      backgroundColor: (theme) => ({
        ...theme('colors'),
      }),
    },
  },
  variants: {
    backgroundColor: ['active'],
  },
  plugins: [],
};
