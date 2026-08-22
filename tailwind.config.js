/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Ardoise / graphite mat — aucun noir pur.
        ink: {
          950: '#0F1115',
          900: '#14171C',
          850: '#191D23',
          800: '#22262E',
          700: '#2C313A',
          600: '#3A404B',
        },
        fg: '#F2F4F7',
        muted: '#B4BAC4',
        faint: '#8A919E',
        // Accent unique, repris du bleu du logo puis désaturé.
        // Aucun dégradé, aucune lueur : la couleur ne sert qu'aux éléments actionnables.
        accent: {
          DEFAULT: '#5B8DEF',
          soft: '#7FA9F5',
          deep: '#3A63C4',
          on: '#0B1020',
        },
        signal: {
          ok: '#6FA980',
          warn: '#C9973F',
          danger: '#D2726B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      boxShadow: {
        panel: '0 1px 2px rgba(0, 0, 0, 0.4)',
        overlay: '0 16px 48px -24px rgba(0, 0, 0, 0.9)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.28s ease-out both',
        'toast-in': 'toast-in 0.22s ease-out both',
      },
    },
  },
  plugins: [],
};
