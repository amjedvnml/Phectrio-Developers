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
        void: {
          DEFAULT: '#000000',
          darker: '#000000',
          card: '#0A0A0A',
          surface: '#121212',
          border: 'rgba(255, 255, 255, 0.1)',
          glow: 'rgba(255, 255, 255, 0.08)'
        },
        monochrome: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', '"Oxanium"', 'sans-serif'],
        logo: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'glow-white': '0 0 35px -5px rgba(255, 255, 255, 0.25)',
        'glow-subtle': '0 0 20px -3px rgba(255, 255, 255, 0.12)',
        'glow-card': '0 0 30px -10px rgba(255, 255, 255, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.8)'
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 65%)',
        'card-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'white-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #A3A3A3 100%)'
      }
    },
  },
  plugins: [],
}
