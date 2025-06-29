/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line tells Tailwind to scan all .jsx files in your src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}