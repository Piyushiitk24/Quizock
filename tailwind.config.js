/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'orbitron': ['Orbitron', 'monospace'],
      },
      colors: {
        'primary-green': '#00ff41',
        'accent-orange': '#ff6b35',
        'dark-charcoal': '#1a1a1a',
        'medium-charcoal': '#2a2a2a',
        'light-charcoal': '#3a3a3a',
        'text-light': '#e0e0e0',
        'text-muted': '#a0a0a0',
        'border-color': '#404040',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00ff41, #00cc33)',
        'gradient-accent': 'linear-gradient(135deg, #ff6b35, #ff8c42)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 255, 65, 0.3)',
        'accent': '0 0 15px rgba(255, 107, 53, 0.2)',
        'glow-lg': '0 0 30px rgba(0, 255, 65, 0.5)',
        'accent-lg': '0 0 25px rgba(255, 107, 53, 0.4)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-left': 'fadeInLeft 0.6s ease-out',
        'glow': 'glow 2s infinite',
        'pulse-glow': 'pulse 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(0, 255, 65, 0.6)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
