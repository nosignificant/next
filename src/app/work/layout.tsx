import "../globals.css";

export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className="w-full">
      <main>
        {children}
      </main>
    </div>
  );
}
