import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(214, 12%, 85%)',
        input: 'hsl(214, 12%, 85%)',
        ring: 'hsl(222, 76%, 60%)',
        background: 'hsl(210, 20%, 98%)',
        foreground: 'hsl(222, 47%, 11%)',
        primary: {
          DEFAULT: 'hsl(222, 76%, 60%)',
          foreground: '#fff'
        },
        secondary: {
          DEFAULT: 'hsl(210, 16%, 96%)',
          foreground: 'hsl(222, 47%, 11%)'
        },
        muted: {
          DEFAULT: 'hsl(210, 16%, 96%)',
          foreground: 'hsl(215, 16%, 46%)'
        },
        accent: {
          DEFAULT: 'hsl(210, 16%, 96%)',
          foreground: 'hsl(222, 47%, 11%)'
        },
        destructive: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          foreground: '#fff'
        },
        card: {
          DEFAULT: '#fff',
          foreground: 'hsl(222, 47%, 11%)'
        }
      },
      borderRadius: {
        lg: '12px',
        md: '10px',
        sm: '8px'
      }
    }
  },
  plugins: []
};

export default config;
