/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        af: {
          bg: '#f6f7fb',
          border: '#e6e8ee',
          text: '#1f2330',
          muted: '#6b7180',
          primary: '#3b6dff',
          primaryDark: '#2b58e6',
          accent: '#7a5cff',
          star: '#f5a623',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
