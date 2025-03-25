/** @type {import('tailwindcss').Config} */
const flowbite = require('flowbite-react/tailwind');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Flowbite content
    flowbite.content(),
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '30px', // From the first config
    },
    screens: {
      xs: '450px',
      sm: '575px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1400px',
    },
    extend: {
      colors: {
        current: 'currentColor',
        transparent: 'transparent',
        white: '#FFFFFF',
        black: '#121723',
        dark: '#1D2430',
        primary: '#4A6CF7',
        yellow: '#FBB040',
        'body-color': '#788293',
        'body-color-dark': '#959CB1',
        'gray-dark': '#1E232E',
        'gray-light': '#F0F2F9',
        stroke: '#E3E8EF',
        'stroke-dark': '#353943',
        'bg-color-dark': '#171C28',
        cyan: {
          '500': 'var(--color-primary)',
          '600': 'var(--color-primary)',
          '700': 'var(--color-primary)',
        },
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
        secondary: 'var(--color-secondary)',
        info: 'var(--color-info)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        lightprimary: 'var(--color-lightprimary)',
        lightsecondary: 'var(--color-lightsecondary)',
        lightsuccess: 'var(--color-lightsuccess)',
        lighterror: 'var(--color-lighterror)',
        lightinfo: 'var(--color-lightinfo)',
        lightwarning: 'var(--color-lightwarning)',
        border: 'var(--color-border)',
        bordergray: 'var(--color-bordergray)',
        lightgray: 'var(--color-lightgray)',
        muted: 'var(--color-muted)',
        link: 'var(--color-link)',
        darklink: 'var(--color-darklink)',
      },
      boxShadow: {
        md: '0px 1px 4px 0px rgba(133, 146, 173, 0.2)',
        lg: '0 1rem 3rem rgba(0, 0, 0, 0.175)',
        'dark-md':
          'rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.02) 0px 12px 24px -4px',
        sm: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
        'btn-shadow': 'box-shadow: rgba(0, 0, 0, .05) 0 9px 17.5px',
        signUp: '0px 5px 10px rgba(4, 10, 34, 0.2)',
        one: '0px 2px 3px rgba(7, 7, 77, 0.05)',
        two: '0px 5px 10px rgba(6, 8, 15, 0.1)',
        three: '0px 5px 15px rgba(6, 8, 15, 0.05)',
        sticky: 'inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)',
        'sticky-dark': 'inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)',
        'feature-2': '0px 10px 40px rgba(48, 86, 211, 0.12)',
        submit: '0px 5px 20px rgba(4, 10, 34, 0.1)',
        'submit-dark': '0px 5px 20px rgba(4, 10, 34, 0.1)',
        btn: '0px 1px 2px rgba(4, 10, 34, 0.15)',
        'btn-hover': '0px 1px 2px rgba(0, 0, 0, 0.15)',
        'btn-light': '0px 1px 2px rgba(0, 0, 0, 0.1)',
      },
      dropShadow: {
        three: '0px 5px 15px rgba(6, 8, 15, 0.05)',
      },
      borderRadius: {
        sm: '7px',
        md: '9px',
        lg: '24px',
        tw: '12px',
      },
      gap: {
        '30': '30px',
      },
      padding: {
        '30': '30px',
      },
      margin: {
        '30': '30px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'), // Flowbite plugin
  ],
};
