/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { 
        bubbler: ["Bubbler One"],
        ruda: ["Ruda"],
        englebert: ["Englebert"],
      }
    },
  },
  plugins: [],
}