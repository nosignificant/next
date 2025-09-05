import Navigator from "../component/Navigator";
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigator />
        {children}
      </body>
    </html>
  );
}
