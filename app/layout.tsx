import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "connect wallet",
  description: "testing connecting wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
