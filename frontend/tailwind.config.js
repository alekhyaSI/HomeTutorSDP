/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // disable automatic media-based dark mode and rely on explicit class if needed
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#e6eeff',
          200: '#c7dbff',
          300: '#9fb8ff',
          400: '#6f8cff',
          500: '#4263ff',
          600: '#2f48e6',
          700: '#2336b3',
          800: '#172380',
          900: '#0d1550'
        },
        accent: {
          500: '#06b6d4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      container: { center: true, padding: '1rem' }
    }
  },
  plugins: [],
};
