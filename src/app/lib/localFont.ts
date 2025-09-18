// src/lib/localfont.ts
import localFont from "next/font/local";

export const pretendard = localFont({
  src: "../fonts/pretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  style: "normal",
});

export const aritaD = localFont({
  src: [
    {
      path: "../fonts/AritaDotumKR-Medium.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-aritaD",
});

//https://stackoverflow.com/questions/77745038/use-ttf-font-in-nextjs-application-correctly
