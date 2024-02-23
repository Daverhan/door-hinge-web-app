const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      home_1: "url('/src/assets/1.jpg')",
      home_2: "url('/src/assets/2.jpg')",
      home_3: "url('/src/assets/3.jpg')",
      screens: {
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
});
