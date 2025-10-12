/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
      sx: { min: "767px" },
    },

    extend: {
      colors: {
        primary: "#35D287",
        grayscale: {
          black: "#141517",
          gray6: "#1E1F23",
          gray5: "#2F3033",
          gray4: "#444549",
          gray3: "#60687D",
          gray2: "#999999",
          gray1: "#F7F7F8",
        },
        system: {
          mint: "#4DFFCD",
          mint2: "#35D287",
          purple: "#8C91FF",
          red: "#FA5252",
          redLight: "#F88180",
          yellow: "#F7C40F",
          skyblue: "#3BAFF5",
        },
        semantic: {
          primary: "#141517",
          secondary: "#1E1F23",
          teriary: "#2F3033",
          fourth: "#444549",
          disabled1: "#999999",
          disabled2: "#60687D",
          accent: "#4DFFCD",
          sub: "#8781FF",
          error: "#FA5252",
        },
        font: {
          point: "#ffffff",
          primary: "#F7F7F8",
          secondary: "#999999",
          teriary: "#444549",
          fourth: "#2F3033",
          disabled: "#60687D",
          dark: "#141517",
          warning: "#FA5252",
        },
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
