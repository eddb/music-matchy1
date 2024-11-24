/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cherry: ['Cherry Bomb One', 'cursive'],
        departure: ['Departure Mono', 'monospace'],
        tech: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
