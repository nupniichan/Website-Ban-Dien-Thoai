/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: '#f42c37',
        secondary: '#fff6a9',
        brandYellow: '#fdc62e',
        brandBlue: '#1376f4',
        brandGreen: '#2dcc6f',
        brandWhite: '#eeeeee',
      },
      container: {
        center: true,
        padding: {
          default: '1rem',
          sm: '3rem',
        },
      },
    },
  },
  plugins: [],
}

