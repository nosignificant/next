import HomeNav from "../component/HomeNav";
import NoteNav from "../component/NoteNav";
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="h-[100px]"></div>
        <HomeNav />
        <NoteNav />
        <main> {children}</main>
      </body>
    </html>
  );
}
