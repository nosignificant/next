import "../globals.css";
import { aritaD } from "../lib/localFont";
import NoteNav from "../component/NoteNav";

import HomeNav from "../component/HomeNav";

export default function NoteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${aritaD.variable}`}>
        <div className="px-4">
          <HomeNav />
          <NoteNav />
          <main> {children}</main>
        </div>
      </body>
    </html>
  );
}
