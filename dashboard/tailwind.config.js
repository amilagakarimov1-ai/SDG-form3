/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-brand': '#22c55e',
        'yellow-brand': '#eab308',
        'red-brand': '#ef4444',
        'dark-bg': '#0f172a',
      }
    },
  },
  plugins: [],
}
