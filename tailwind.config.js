/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Núcleo M3 (espelha tokens da Fase 3 web — ver docs/fase 3/11-design-system.md)
        background: '#F9F9FF',
        foreground: '#111C2D',
        muted: '#43474E',
        border: '#C4C6CF',
        card: '#E7EEFF',

        primary: '#022448',
        'primary-foreground': '#FFFFFF',
        'primary-container': '#1E3A5F',
        'on-primary-container': '#8AA4CF',

        secondary: '#006A61',
        'secondary-container': '#86F2E4',
        'on-secondary-container': '#006F66',

        // Surface variants (M3)
        'surface-container-low': '#F0F3FF',
        'surface-container-high': '#DEE8FF',
        'surface-container-lowest': '#FFFFFF',

        outline: '#74777F',

        // Semânticos
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
