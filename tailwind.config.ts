import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#1CD6CE',
          dark: '#1B2430',
          navy: '#00587A',
          light: '#E4FBFF',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        sans: ['Source Sans Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
