import { pretendard } from "../lib/localFont";
import "../globals.css";
import Navigator from "../component/Navigator";

export default function NoteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="h-[100px]"></div>
        <Navigator />
        <main> {children}</main>
      </body>
    </html>
  );
}
//{`${pretendard.variable} ${geistMono.variable} antialiased`}
