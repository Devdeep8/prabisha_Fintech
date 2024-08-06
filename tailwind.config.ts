import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      "colors": {
        "border": {
          "DEFAULT": "hsl(210, 20%, 90%)",
          "white": "#ffffff",
          "black": "#000000"
        },
        "input": {
          "DEFAULT": "hsl(0, 0%, 20%)",
          "white": "#ffffff",
          "black": "#000000"
        },
        "ring": {
          "DEFAULT": "hsl(0, 0%, 25%)",
          "white": "#ffffff",
          "black": "#000000"
        },
        "background": {
          "DEFAULT": "hsl(0, 0%, 100%)",
          "white": "#ffffff",
          "black": "#000000"
        },
        "foreground": {
          "DEFAULT": "hsl(210, 24%, 16%)",
          "white": "#ffffff",
          "black": "#000000"
        },
        "primary": {
          "DEFAULT": "hsl(210, 22%, 88%)",
          "electric": "#007BFF"
        },
        "secondary": {
          "DEFAULT": "#00BFA6",
          "slate": "#6C757D"
        },
        "neutral": {
          "light": "#F8F9FA",
          "DEFAULT": "#FFFFFF",
          "dark": "#343A40"
        },
        "success": {
          "DEFAULT": "#28A745",
          "foreground": "hsl(0, 0%, 100%)"
        },
        "error": {
          "DEFAULT": "#FFC107",
          "foreground": "hsl(0, 0%, 100%)"
        },
        "destructive": {
          "DEFAULT": "#DC3545",
          "foreground": "hsl(0, 0%, 100%)"
        },
        "info": {
          "DEFAULT": "#17A2B8",
          "foreground": "hsl(0, 0%, 100%)"
        },
        "caution": {
          "DEFAULT": "#ffc658",
          "foreground": "hsl(0, 0%, 100%)"
        },
        "muted": {
          "DEFAULT": "hsl(210, 22%, 88%)",
          "foreground": "hsl(210, 24%, 16%)",
          "white": "#ffffff",
          "black": "#000000"
        },
        "accent": {
          "DEFAULT": "#66A3FF",
          "foreground": "hsl(0, 0%, 100%)",
          "white": "#ffffff",
          "black": "#000000"
        },
        "popover": {
          "DEFAULT": "hsl(0, 0%, 100%)",
          "foreground": "hsl(210, 24%, 16%)",
          "white": "#ffffff",
          "black": "#000000"
        },
        "card": {
          "DEFAULT": "hsl(255, 255, 255)"
        }
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)", // default radius value
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      }, 
      keyframes: { 
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
