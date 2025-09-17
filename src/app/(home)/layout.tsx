import HomeNav from "../component/HomeNav";
import "../globals.css";
import aritaD_M from "next/font/local";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="aritaD_M">
        <div className="px-4 ">
          <HomeNav />
        </div>
        <main> {children}</main>
      </body>
    </html>
  );
}
