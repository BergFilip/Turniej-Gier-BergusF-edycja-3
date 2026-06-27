/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        blood: {
          50: '#fff0f0',
          400: '#ff4040',
          500: '#ff1717',
          600: '#d90016',
          800: '#76000d',
          950: '#210006',
        },
        obsidian: '#050407',
      },
      boxShadow: {
        neon: '0 0 16px rgba(255, 23, 23, .72), inset 0 0 18px rgba(255, 23, 23, .22)',
        hot: '0 0 30px rgba(255, 23, 23, .42)',
      },
      animation: {
        pulseGlow: 'pulseGlow 1.8s ease-in-out infinite',
        scan: 'scan 5s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(255,23,23,.45))' },
          '50%': { filter: 'drop-shadow(0 0 22px rgba(255,23,23,.95))' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
