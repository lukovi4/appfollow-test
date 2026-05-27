/** @type {import('tailwindcss').Config} */
// Палитра, отступы, радиусы и типографика — извлечены из CSS-токенов AppFollow.
// Источник: переменные --color-*, --pd-*, --radius-*, --text-*, --font-* в их продакшен-CSS.
// Семантика классов сохранена близко к их именам (af.bg.primary = --color-background-primary).
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Брейкпоинты AppFollow (из медиа-запросов их CSS):
    // 640 / 768 / 1024 / 1200 / 1366 / 1440 / 1536 / 1800 / 1921.
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1200px',
      '2xl': '1366px',
      '3xl': '1440px',
      '4xl': '1536px',
      '5xl': '1800px',
      '6xl': '1921px',
    },
    extend: {
      colors: {
        af: {
          // Базовая шкала (light theme)
          white: '#ffffff',
          gray: {
            '05': '#fafbfe',
            1: '#f7f9fc',
            2: '#f0f5fa',
            3: '#e6effa',
            4: '#dae7f7',
            5: '#aebed4',
            6: '#92a1b2',
            7: '#64788f',
            75: '#3c516b',
            8: '#213752',
            9: '#0b0f14',
          },
          blue: {
            1: '#e6f3ff',
            2: '#baddff',
            3: '#75b4fd',
            4: '#3996ff',
            5: '#2380f9',
            6: '#388eff',
            7: '#74b0fd',
          },
          red: { 1: '#fff7f8', 2: '#fee4e7', 3: '#fec2c9', 4: '#fd334b' },
          green: { 1: '#eaffea', 2: '#d9f4d8', 3: '#aae6a8', 4: '#36c55f' },
          yellow: { 1: '#fffcf1', 2: '#fff6d4', 3: '#fceebd', 4: '#edbc2f' },
          purple: {
            1: '#dcd4fa', 2: '#beaef6', 3: '#9f88f2', 4: '#9176f2',
            5: '#8364f3', 6: '#724ff2', 7: '#643df2', 8: '#552bef', 9: '#4619ec',
          },
          // Семантика
          text: {
            primary: '#213752',    // gray-8
            secondary: '#64788f',  // gray-7
            tertiary: '#92a1b2',   // gray-6
            link: '#2380f9',       // blue-5
            positive: '#36c55f',
            negative: '#fd334b',
            white: '#ffffff',
          },
          bg: {
            primary: '#ffffff',
            page: '#f7f9fc',
            secondaryWhite: '#f7f9fc', // gray-1
            secondaryGray: '#f0f5fa',  // gray-2
            stroke: '#e6effa',         // gray-3
            strokeDark: '#dae7f7',     // gray-4
            dark: '#213752',           // gray-8
          },
          icon: {
            primary: '#213752',
            secondary: '#64788f',
            tertiary: '#92a1b2',
            link: '#2380f9',
            negative: '#fd334b',
            white: '#ffffff',
          },
          star: {
            five: '#66b47c',
            four: '#bdd280',
          },
        },
      },
      borderRadius: {
        'af-sm': '2px',
        'af-md': '4px',
        'af-lg': '8px',
        'af-xl': '12px',
        'af-xxl': '16px',
      },
      borderWidth: {
        'af-sm': '1px',
        'af-md': '2px',
        'af-lg': '4px',
      },
      spacing: {
        'af-xxxxs': '2px',
        'af-xxxs': '4px',
        'af-xxs': '8px',
        'af-xs': '12px',
        'af-sm': '16px',
        'af-md': '20px',
        'af-lg': '24px',
        'af-xl': '32px',
        'af-xxl': '40px',
        'af-xxxl': '64px',
      },
      fontSize: {
        // Парные значения [font-size, { lineHeight, letterSpacing }] —
        // точные токены AppFollow: --text-* + соответствующие --line-* + --letter-*.
        'af-xs': ['10px', { lineHeight: '14px' }],          // text-xs / line-xs
        'af-sm': ['12px', { lineHeight: '18px' }],          // text-sm / line-sm
        'af-md': ['14px', { lineHeight: '20px', letterSpacing: '-0.12px' }], // text-md / line-md / letter-sm
        'af-lg': ['16px', { lineHeight: '20px' }],          // text-lg / line-md
        'af-h-xs': ['18px', { lineHeight: '24px' }],
        'af-h-sm': ['20px', { lineHeight: '24px' }],        // header-sm / line-lg
        'af-h-md': ['26px', { lineHeight: '44px' }],        // header-md / line-xxl
        'af-h-lg': ['30px', { lineHeight: '36px' }],        // header-lg / line-xl
        'af-h-xl': ['36px', { lineHeight: '44px' }],
      },
      lineHeight: {
        'af-xxs': '12px',
        'af-xs': '14px',
        'af-sm': '18px',
        'af-md': '20px',
        'af-lg': '24px',
        'af-xl': '36px',
        'af-xxl': '44px',
      },
      letterSpacing: {
        'af-xxs': '-0.4px',
        'af-xs': '-0.24px',
        'af-sm': '-0.12px',
        'af-md': '-0.08px',
        'af-lg': '0.5px',
        'af-xl': '0.6px',
      },
      height: {
        'af-input-sm': '28px',
        'af-input-md': '36px',
        'af-input-lg': '48px',
      },
      minHeight: {
        'af-input-sm': '28px',
        'af-input-md': '36px',
        'af-input-lg': '48px',
      },
      width: {
        'af-sidebar-narrow': '60px',
        'af-sidebar-wide': '215px',
      },
      minWidth: {
        'af-sidebar-narrow': '60px',
        'af-sidebar-wide': '215px',
      },
      backgroundImage: {
        'af-paid': 'linear-gradient(97deg, #643df2 0%, #9f88f2 100%)',
        'af-paid-hover': 'linear-gradient(97deg, #724ff2 0%, #beaef6 100%)',
      },
      fontFamily: {
        sans: ['Lato', 'Arial', 'Helvetica', 'sans-serif'],
      },
      fontWeight: {
        'af-normal': '400',
        'af-bold': '700',
      },
    },
  },
  plugins: [],
}
