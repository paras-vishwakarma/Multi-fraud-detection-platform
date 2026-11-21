

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B1120",
        panel: "#111827",
        cyan: "#38BDF8",
      },
    },
  },
  plugins: [],
};
