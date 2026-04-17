import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./lib/**/*.{ts,tsx,js,jsx}",
    "./app/globals.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        accent: {
          DEFAULT: "hsl(var(--accent))",
          dark: "hsl(var(--accent-dark))",
          dim: "hsl(var(--accent-dim))",
          text: "hsl(var(--accent-text))",
        },
        bg: {
          page: "hsl(var(--bg-page))",
          card: "hsl(var(--bg-card))",
          sidebar: "hsl(var(--bg-sidebar))",
          input: "hsl(var(--bg-input))",
          hover: "hsl(var(--bg-hover))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          body: "hsl(var(--text-body))",
          muted: "hsl(var(--text-muted))",
          faint: "hsl(var(--text-faint))",
        },
        muted: "hsl(var(--text-muted))",
        faint: "hsl(var(--text-faint))",
        border: {
          DEFAULT: "hsl(var(--border))",
          default: "hsl(var(--border))",
          strong: "hsl(var(--border-strong))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          bg: "hsl(var(--success-bg))",
          text: "hsl(var(--success-text))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          bg: "hsl(var(--warning-bg))",
          text: "hsl(var(--warning-text))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          bg: "hsl(var(--error-bg))",
          text: "hsl(var(--error-text))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          bg: "hsl(var(--info-bg))",
          text: "hsl(var(--info-text))",
        },
        default: "hsl(var(--border))",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shine: {
          "0%": { left: "-100%" },
          "100%": { left: "200%" },
        },
        "grid-move": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(40px)" },
        },
        float: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "20%": { opacity: "0.8" },
          "100%": {
            transform: "translateY(-110vh) translateX(40px)",
            opacity: "0",
          },
        },
        "road-marks": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-80px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s cubic-bezier(0.34,1.4,0.64,1)",
        shine: "shine 3s ease-in-out infinite",
        "grid-move": "grid-move 18s linear infinite",
        float: "float 10s linear infinite",
        "road-marks": "road-marks 1s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
