/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#748096",
        line: "#e8ebf1",
        panel: "#ffffff",
        page: "#f5f7fb"
      }
    }
  },
  plugins: []
};
