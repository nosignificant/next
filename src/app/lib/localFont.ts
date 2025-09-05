import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "../fonts/pretendard-variable.woff2",
      weight: "400",
      style: "regular",
    },
    {
      path: "../fonts/pretendard-variable.woff2",
      weight: "500",
      style: "medium",
    },
    {
      path: "../fonts/pretendard-variable.woff2",
      weight: "600",
      style: "semibold",
    },
  ],
});
