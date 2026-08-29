import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#ffffff",
        muted: "#9ca3af",
        canvas: "#080808",
        surface: "#0f0f0f",
        "surface-subtle": "#151515",
        "surface-hover": "#1e1e1e",
        accent: "#ffffff",
        "accent-dark": "#e5e5e5",
        line: "rgba(255, 255, 255, 0.10)",
        "line-subtle": "rgba(255, 255, 255, 0.06)",
        danger: "#ef4444",
        "danger-muted": "#dc2626",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
} satisfies Config;
