import "../globals.css";
import { aritaD } from "../lib/localFont";


export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className={`${aritaD.variable} font-arita w-full`}>
      <main>
        {children}
      </main>
    </div>
  );
}
