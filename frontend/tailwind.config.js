const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "screen-adjusted": "calc(100vh - 64px)",
      },
      screens: {
        "3xl": "1920px",
      },
      backgroundImage: {
        houses_background: "url(/src/assets/HeroImage.jpg)",
      },
    },
    fontFamily: {
      raleway: ["Raleway", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
});
