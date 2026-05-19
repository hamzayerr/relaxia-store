import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#EDE8D5',
          dark: '#E0D8C0',
          darker: '#D8D0B8',
          light: '#F5F1E6',
        },
        brand: {
          50:  '#F0F7F4',
          100: '#D4E8DD',
          200: '#A9D1BB',
          300: '#7DBA99',
          400: '#52A377',
          500: '#268C55',
          600: '#1B7344',
          700: '#0B4D2E',
          800: '#083A22',
          900: '#0F1F16',
        },
        gold: {
          300: '#E8D08A',
          400: '#D4B85A',
          500: '#C9A84C',
          600: '#B8960A',
          700: '#8C7208',
        },
      },
      fontFamily: {
        cairo: ['var(--font-cairo)', 'sans-serif'],
        tajawal: ['var(--font-tajawal)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        up: '0 -4px 16px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-in-left': 'slideInLeft 0.3s ease',
        'scale-in': 'scaleIn 0.25s ease',
        'bounce-once': 'bounceOnce 0.4s ease',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        bounceOnce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
