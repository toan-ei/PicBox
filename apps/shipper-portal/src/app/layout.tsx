import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ShipperNav from '@/components/ShipperNav'

const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'PicBox Shipper',
  description: 'Cổng thông tin dành cho Shipper PicBox',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased bg-gray-950 text-white">
        <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
          <main className="flex-1 pb-20 overflow-auto">
            {children}
          </main>
          <ShipperNav />
        </div>
      </body>
    </html>
  )
}