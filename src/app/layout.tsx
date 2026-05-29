import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gio Tasks | Firebase Kanban",
  description: "A private drag and drop task board with Google authentication and Firebase sync.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
