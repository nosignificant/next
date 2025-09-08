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
        pretendard: [pretendard.variable, "sans-serif"], // 👈 여기 pretendard 키로 등록
      },
    },
  },
};

export default config;
