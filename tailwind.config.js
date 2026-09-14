/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: '#000000',
          card: '#1C1C1E',
          cardHover: '#2C2C2E',
          blue: '#0A84FF',
          green: '#30D158',
          orange: '#FF9F0A',
          purple: '#BF5AF2',
          red: '#FF453A',
        }
      }
    },
  },
  plugins: [],
}
