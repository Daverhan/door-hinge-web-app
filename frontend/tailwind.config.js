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
    },
  },
  plugins: [],
});
