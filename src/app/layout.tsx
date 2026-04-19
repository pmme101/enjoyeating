import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnjoyEating",
  description: "Photo-based nutrition tracking for busy people — 每日营养记录",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
