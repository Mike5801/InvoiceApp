/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,pug}"],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}