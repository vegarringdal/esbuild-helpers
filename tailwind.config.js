
module.exports = {
  purge: {
    enabled: process.env.PRODUCTION,
    content: ["./src_client/**/*.ts"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
