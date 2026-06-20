import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DriverNav from '@/components/DriverNav'

const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'PicBox Driver',
  description: 'Cổng thông tin dành cho Driver nội bộ PicBox',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased bg-gray-950 text-white">
        <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
          <main className="flex-1 pb-20 overflow-auto">
            {children}
          </main>
          <DriverNav />
        </div>
      </body>
    </html>
  )
}