// src/lib/localfont.ts
import localFont from "next/font/local";

export const pretendard = localFont({
  src: "../fonts/pretendard-variable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  style: "normal",
});

export const aritaD_M = localFont({
  src: "../fonts/AritaDotumKR-Medium.ttf",
  variable: "--font-aritaD-medium",
  display: "swap",
});

export const aritaD_SB = localFont({
  src: "../fonts/AritaDotumKR-SemiBold.ttf",
  variable: "--font-aritaD-semibold",
  display: "swap",
});
