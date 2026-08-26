/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Carbone profond — fonds et surfaces.
        ink: {
          950: '#06080B',
          900: '#0A0D12',
          850: '#0E1219',
          800: '#12171F',
          700: '#212833',
          600: '#2D3747',
        },
        fg: '#FFFFFF',
        muted: '#CBD5E1',
        faint: '#94A3B8',
        // Accent principal : laiton chaud.
        accent: {
          DEFAULT: '#D9A441',
          soft: '#F2CE85',
          deep: '#A87526',
          on: '#06080B',
        },
        // Accent secondaire, repris du bleu du logo — pôle technique uniquement.
        ice: {
          DEFAULT: '#7FD8FF',
          deep: '#2C93C4',
        },
        signal: {
          ok: '#34D399',
          warn: '#FCD34D',
          danger: '#FB7185',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Archivo Variable', 'Archivo', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -12px rgba(217, 164, 65, 0.55)',
        'glow-ice': '0 0 40px -12px rgba(127, 216, 255, 0.5)',
        card: '0 24px 60px -32px rgba(0, 0, 0, 0.9)',
        panel: '0 24px 60px -32px rgba(0, 0, 0, 0.9)',
        overlay: '0 32px 80px -32px rgba(0, 0, 0, 0.95)',
      },
      backgroundImage: {
        'grid-carbon':
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        'radial-brass':
          'radial-gradient(60% 60% at 50% 40%, rgba(217,164,65,0.20) 0%, rgba(217,164,65,0) 70%)',
      },
      backgroundSize: {
        grid: '56px 56px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 7s ease-in-out infinite',
        'toast-in': 'toast-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
