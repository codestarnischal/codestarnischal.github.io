import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "24px",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#0f172a",
        muted: "#e5e7eb",
        card: "#ffffff",
        border: "#e5e7eb",
        ring: "#3b82f6",
        accent: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
        },
        destructive: "#ef4444",
        success: "#10b981",
        warning: "#f59e0b",
      },
      borderRadius: {
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(2, 6, 23, 0.08)",
        soft: "0 1px 2px rgba(0,0,0,0.04)",
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;