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
        <div className="px-4">
          <HomeNav />
        </div>
        <main> {children}</main>
      </body>
    </html>
  );
}
