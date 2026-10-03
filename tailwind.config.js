/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./src/**/*.{html,js,css}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        zinc: {
          925: '#121217',
          950: '#09090b',
        },
      },
      boxShadow: {
        'glow-violet': '0 0 25px rgba(139, 92, 246, 0.25)',
        'glow-rose': '0 0 25px rgba(244, 63, 94, 0.25)',
      },
    },
  },
  plugins: [],
}
