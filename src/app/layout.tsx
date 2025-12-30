import "./globals.css";
import { pretendard } from "./lib/localFont";
import NoteNav from "./component/NoteNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} font-pretendard text-neutral-800 bg-white`}>

        <div className="px-4 sm:px-6 min-h-screen flex flex-col">
          
          {/* ✅ 상단 네비게이션 수정됨 */}
          <header className="
            sticky top-0 z-50             
            flex items-center gap-6       
            bg-white/80 backdrop-blur-md  
            py-4 mb-4                     
          ">
            <NoteNav />
          </header>

          <main className="flex-1 w-full relative">
            {children}
          </main>
          
          <footer className="py-10 text-center text-sm text-neutral-400 mb-10">
            © 2025 雲散霧消. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}