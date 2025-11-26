/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        elevate: {
          bg: '#f3f4f6', // Light gray background
          'bg-dark': '#111827', // Dark background
          card: '#ffffff', // White card background
          'card-dark': '#1f2937', // Dark card background
          primary: '#3b82f6', // Bright Blue
          success: '#10b981', // Green
          error: '#ef4444', // Red
          text: '#1f2937', // Dark slate
          'text-dark': '#f9fafb', // Light text for dark mode
          subtext: '#6b7280', // Gray text
          'subtext-dark': '#9ca3af', // Light gray text for dark mode
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'elevate': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevate-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
