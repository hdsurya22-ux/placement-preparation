/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(245, 58%, 51%)"
      }
    }
  },
  plugins: []
};

