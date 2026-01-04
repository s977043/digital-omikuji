/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        shippori: ["ShipporiMincho_400Regular"],
        "shippori-bold": ["ShipporiMincho_700Bold"],
      },
    },
  },
  plugins: [],
};
