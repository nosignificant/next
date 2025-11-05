import "../globals.css";
import { aritaD } from "../lib/localFont";
import NoteNav from "../component/NoteNav";

export default function NoteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${aritaD.variable}`}>
        <div className="px-4 ">
          <main> {children}</main>
        </div>
      </body>
    </html>
  );
}
