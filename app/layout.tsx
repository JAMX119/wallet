import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "钱包管理系统",
  description: "安全、便捷的数字钱包管理工具",
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
