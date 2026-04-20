import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif-display': ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      fontSize: {
        'brand-caption': ['0.64rem', { lineHeight: '1.4' }],
        'brand-small': ['0.8rem', { lineHeight: '1.5' }],
        'brand-base': ['1rem', { lineHeight: '1.6' }],
        'brand-h3': ['1.25rem', { lineHeight: '1.4' }],
        'brand-h2': ['1.563rem', { lineHeight: '1.3' }],
        'brand-h1': ['1.953rem', { lineHeight: '1.2' }],
        'brand-display': ['2.441rem', { lineHeight: '1.1' }],
      },
      colors: {
        brand: {
          bg: '#0d0b08',
          surface: '#13110e',
          elevated: '#1a1714',
          border: '#2a2520',
          'border-hover': '#3a352e',
          text: '#e8e0d4',
          secondary: '#a89e8f',
          muted: '#7a7068',
          'muted-dark': '#5c5449',
          accent: '#94a99b',
          'accent-hover': '#a3b5aa',
          'accent-dim': '#94a99b1a',
          warm: '#c4a35a',
          danger: '#8b3a3a',
          'danger-hover': '#a04444',
          success: '#94a99b',
          warning: '#c4a35a',
          light: '#faf6f0',
        },
      },
    },
  },
  plugins: [],
};
export default config;
