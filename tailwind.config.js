/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter_400Regular'],
        'sans-medium': ['Inter_500Medium'],
        'sans-semibold': ['Inter_600SemiBold'],
        'sans-bold': ['Inter_700Bold'],
        'sans-extrabold': ['Inter_800ExtraBold'],
        'sans-black': ['Inter_900Black'],
        jetbrains: ['JetBrainsMono_400Regular'],
      },
      colors: {
        // Núcleo M3 (espelha tokens da Fase 3 web)
        background: '#F9F9FF',
        foreground: '#111C2D',
        muted: '#43474E',
        border: '#C4C6CF',
        card: '#E7EEFF', // alias legacy

        // Surface scale
        surface: '#F9F9FF',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F0F3FF',
        'surface-container': '#E7EEFF',
        'surface-container-high': '#DEE8FF',

        // Primary
        primary: '#022448',
        'primary-foreground': '#FFFFFF',
        'primary-container': '#1E3A5F',
        'on-primary-container': '#8AA4CF',

        // Secondary
        secondary: '#006A61',
        'secondary-container': '#86F2E4',
        'on-secondary-container': '#005049',

        // Outlines
        outline: '#74777F',
        'outline-variant': '#C4C6CF',

        // Status
        'status-published': '#22C55E',
        'status-draft': '#EAB308',
        'status-archived': '#94A3B8',

        // Semantic
        success: '#16A34A',
        warning: '#D97706',
        error: '#BA1A1A',
        'error-container': '#FFDAD6',
      },
      borderRadius: {
        // Escala M3 (Fase 3 documenta valores customizados — divergem do default Tailwind)
        DEFAULT: '0.125rem', // 2px
        lg: '0.25rem',       // 4px
        xl: '0.5rem',        // 8px
        full: '0.75rem',     // 12px
      },
    },
  },
  plugins: [],
};
