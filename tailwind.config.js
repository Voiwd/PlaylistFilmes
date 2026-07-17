/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#0d0d0d',
          100: '#111111',
          200: '#181818',
          300: '#222222',
        },
      },
    },
  },
  plugins: [],
}
