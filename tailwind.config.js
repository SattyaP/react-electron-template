module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
  daisyui: {
    themes: [
      {
        lightdim: {
          'color-scheme': 'light',
          neutral: '#4C566A',
          'neutral-content': '#D8DEE9',
          'base-100': '#ECEFF4',
          'base-200': '#E5E9F0',
          'base-300': '#D8DEE9',
          'base-content': '#2E3440',
        },
      },
      'dark',
    ],
  },
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {},
  variants: {},
  plugins: [require('daisyui')],
};
