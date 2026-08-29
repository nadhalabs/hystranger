import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12233f",
        muted: "#69758a",
        canvas: "#fbfaf7",
        accent: "#ff6b5e",
        "accent-dark": "#ea564a",
        line: "#e7e7e3",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(18, 35, 63, 0.10)",
      },
    },
  },
  plugins: [],
} satisfies Config;
