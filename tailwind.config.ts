// tailwind.config.ts
import type { Config } from "tailwindcss";
import { pretendard } from "./src/app/lib/localFont"; // 경로 확인

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: [pretendard.variable, "sans-serif"],
        aritaD_M: "var(--font-aritaD-medium)",
        aritaD_SB: "var(--font-aritaD-semibold)",
      },
    },
  },
};

export default config;
