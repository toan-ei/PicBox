import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "PicBox Ops Dashboard", description: "Bảng điều hành vận hành - PicBox" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body>{children}</body></html>;
}
