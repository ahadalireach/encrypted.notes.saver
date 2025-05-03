import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        bounce: "bounce 1.2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [typography],
  safelist: [
    "bg-red-500",
    "text-red-500",
    "bg-yellow-500",
    "text-yellow-500",
    "bg-green-500",
    "text-green-500",
  ],
};
