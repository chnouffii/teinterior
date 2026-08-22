/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        carbon: {
          950: '#06080B',
          900: '#0A0D12',
          850: '#0E1219',
          800: '#12171F',
          700: '#191F2A',
          600: '#222A38',
          500: '#2D3747',
        },
        brass: {
          DEFAULT: '#D9A441',
          light: '#F2CE85',
          deep: '#A87526',
          glow: 'rgba(217, 164, 65, 0.35)',
        },
        ice: {
          DEFAULT: '#7FD8FF',
          deep: '#2C93C4',
        },
      },
      fontFamily: {
        display: ['Sora', 'Segoe UI', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -12px rgba(217, 164, 65, 0.55)',
        'glow-ice': '0 0 40px -12px rgba(127, 216, 255, 0.5)',
        card: '0 24px 60px -32px rgba(0, 0, 0, 0.9)',
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        'pulse-ring': {
          '0%': { opacity: '0.7', transform: 'scale(0.9)' },
          '100%': { opacity: '0', transform: 'scale(1.6)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 2.8s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s ease-out infinite',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};
