import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PicBox Admin",
    template: "%s | PicBox Admin",
  },
  description: "PicBox Delivery System — Bảng điều khiển quản trị",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} dark`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
