import { pretendard } from "../lib/localFont";
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
        <div className="h-[100px]"></div>
        <HomeNav />
        <NoteNav />
        <main> {children}</main>
      </body>
    </html>
  );
}
//{`${pretendard.variable} ${geistMono.variable} antialiased`}
