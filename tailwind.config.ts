import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Важно: это включает переключение тем через класс
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Здесь позже добавим шрифты и кастомные цвета
    },
  },
  plugins: [],
};

export default config;
