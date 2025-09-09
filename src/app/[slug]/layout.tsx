import "../globals.css";
import NoteNav from "../component/NoteNav";
import HomeNav from "../component/HomeNav";

export default function NoteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="px-4 sticky top-0 ">
          <HomeNav />

          <main> {children}</main>
        </div>
      </body>
    </html>
  );
}
