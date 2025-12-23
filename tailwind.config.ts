import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        ai: {
          purple: '#8B5CF6',
          'purple-dark': '#7C3AED',
          cyan: '#06B6D4',
          'cyan-light': '#22D3EE',
          pink: '#EC4899',
          'pink-light': '#F472B6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neural-pulse': 'neural-pulse 3s ease-in-out infinite',
        'typing-cursor': 'typing-cursor 1s step-end infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.05)' },
        },
        'neural-pulse': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        'typing-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            a: {
              color: '#06B6D4',
              '&:hover': {
                color: '#0891B2',
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              color: '#8B5CF6',
              backgroundColor: '#F3F4F6',
              paddingLeft: '0.375rem',
              paddingRight: '0.375rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            pre: {
              backgroundColor: '#1F2937',
              color: '#F9FAFB',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
            },
            h1: {
              background: 'linear-gradient(to right, #8B5CF6, #06B6D4, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            },
            h2: {
              color: '#1F2937',
              borderBottomWidth: '1px',
              borderBottomColor: '#E5E7EB',
              paddingBottom: '0.5rem',
            },
            h3: {
              color: '#374151',
            },
            blockquote: {
              borderLeftColor: '#8B5CF6',
              color: '#4B5563',
            },
            table: {
              width: '100%',
            },
            th: {
              backgroundColor: '#F3F4F6',
              borderWidth: '1px',
              borderColor: '#D1D5DB',
              padding: '0.5rem',
              textAlign: 'left',
            },
            'th:first-child': {
              paddingLeft: '0.75rem',
            },
            td: {
              borderWidth: '1px',
              borderColor: '#D1D5DB',
              padding: '0.5rem',
            },
            'td:first-child': {
              paddingLeft: '0.75rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config
