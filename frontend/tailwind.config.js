/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#FFFCF5',
        'panel-dark': '#111827',
        'panel-secondary': '#0F172A',
        cyan: {
          brand: '#06B6D4',
          button: '#0891B2',
          light: '#E6F9FC',
          hover: '#0e7490',
        },
        dark: {
          text: '#1E293B',
          muted: '#64748B',
        },
        light: {
          text: '#FFFFFF',
          secondary: '#94A3B8',
        },
        border: {
          subtle: '#DCE3EA',
          dark: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(30, 41, 59, 0.04), 0 6px 16px rgba(30, 41, 59, 0.03)',
        'card': '0 2px 6px rgba(30, 41, 59, 0.04), 0 10px 24px rgba(30, 41, 59, 0.05)',
        'cyan-glow': '0 0 25px rgba(6, 182, 212, 0.25)',
      },
    },
  },
  plugins: [],
};
