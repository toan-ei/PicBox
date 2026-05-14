import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShipNow',
  description: 'Nền tảng giao hàng',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}