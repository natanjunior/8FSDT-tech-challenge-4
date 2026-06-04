/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#0F172A',
        muted: '#64748B',
        border: '#E2E8F0',
        card: '#F8FAFC',
        primary: '#2563EB',
        'primary-foreground': '#FFFFFF',
        secondary: '#F1F5F9',
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
      },
    },
  },
  plugins: [],
};
