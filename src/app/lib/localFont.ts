// src/lib/localfont.ts
import localFont from "next/font/local";

export const pretendard = localFont({
  src: "../fonts/pretendard-variable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  style: "normal",
});
