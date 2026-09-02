export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14302E", teal: { DEFAULT: "#1F6F6B", dark: "#16504D", light: "#E6F0EE" },
        paper: "#F3F5F3", line: "#D8E0DC", muted: "#5C7370",
        amber: "#8A5A09", red: "#A8342C"
      },
      fontFamily: { sans: ["Onest", "system-ui", "sans-serif"], read: ["Literata", "Georgia", "serif"] }
    }
  },
  plugins: []
};
