/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tesla-black': '#000000',
        'tesla-dark-gray': '#171a20',
        'tesla-gray': '#393c41',
        'tesla-light-gray': '#f4f4f4',
        'tesla-white': '#ffffff',
        'tesla-red': '#e31937',
        'tesla-blue': '#3e6ae1',
      },
    },
  },
  plugins: [],
}
