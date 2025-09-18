import HomeNav from "../component/HomeNav";
import "../globals.css";
import { aritaD } from "../lib/localFont";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${aritaD.variable}`}>
        <div className="px-4 ">
          <HomeNav />
        </div>
        <main> {children}</main>
      </body>
    </html>
  );
}
