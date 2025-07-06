import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mjs}',
    './src/components/**/*.{js,ts,jsx,tsx,mjs}',
  ],
  theme: {
    extend: {
      colors: {
        doodleYellowMustard: '#CCC27A',
        doodleBlueSoft: '#7A97CC',
        doodlePurpleSoft: '#907ACC',
        doodlePurpleLight: '#C8B8E2',
        doodlePinkPastel: '#F6C5D5',
        doodleBlueSky: '#A8D0E6',
        doodleGreenPastel: '#BFE6C3',
        doodleYellowLight: '#FFF2B2',
        doodleBeigeLight: '#F6EDE3',
      },
      fontFamily: {
        mali: ['var(--font-mali)', ...defaultTheme.fontFamily.sans],
        magnolia: ['var(--font-magnolia)', ...defaultTheme.fontFamily.serif],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
