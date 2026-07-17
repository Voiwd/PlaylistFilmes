/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral charcoal palette, deliberately free of Tailwind's blue undertone.
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#383838',
          800: '#202020',
          900: '#161616',
          950: '#0a0a0a',
        },
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
