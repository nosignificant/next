import "./globals.css";
import NoteNav from "./component/NoteNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="text-neutral-800 bg-white font-serif tracking-tight">

        <div className="px-4 sm:px-6 min-h-screen flex flex-col">
          
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
            © 2025 雲散霧消
          </footer>
        </div>
      </body>
    </html>
  );
}