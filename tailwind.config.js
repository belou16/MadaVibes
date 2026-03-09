/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mada: {
          midnight: "#0f172a",
          slate: "#1e293b",
          gold: "#f59e0b",
          emerald: "#10b981",
          text: "#f8fafc"
        }
      },
      boxShadow: {
        glow: "0 20px 60px rgba(16, 185, 129, 0.25)"
      },
      backgroundImage: {
        "mada-gradient": "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
      },
      fontFamily: {
        display: ["SF Pro Display", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};