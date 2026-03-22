/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mebi-blue': '#1a365d',
        'mebi-light': '#2b6cb0',
        'mebi-accent': '#ebf8ff',
      }
    },
  },
  plugins: [],
}
