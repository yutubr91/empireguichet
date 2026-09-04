/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#E8A93B',
        goldSoft: '#F4C87C',
        teal: '#2BBF8A',
        dark: '#1B2A41',
        darkSoft: '#2A3F5F',
        danger: '#E2685E',
        text: '#F1F5F9',
        textMuted: '#94A3B8',
        surface: '#243447',
        surfaceLine: '#334155',
        bgSoft: '#1E293B'
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}