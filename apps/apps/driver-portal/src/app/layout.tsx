import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "PicBox Driver Portal", description: "Cổng thông tin Driver - PicBox" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body>{children}</body></html>;
}
