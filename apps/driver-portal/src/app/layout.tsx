import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DriverSidebar from '@/components/DriverSidebar'
import DriverNavbar from '@/components/DriverNavbar'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ShipNow Driver',
  description: 'Cổng thông tin dành cho Driver nội bộ ShipNow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      {/*
        Chuyển từ layout mobile (max-w-md + bottom nav)
        sang layout desktop giống sender-web (sidebar trái + navbar trên)
        — giữ nguyên dark green theme đặc trưng của driver portal.
      */}
      <body className="antialiased bg-[#020f0a] text-white">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar cố định bên trái */}
          <DriverSidebar />

          {/* Phần bên phải: navbar + content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DriverNavbar />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}