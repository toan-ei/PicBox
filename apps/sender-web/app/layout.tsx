import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import PageTransition from '@/components/ui/PageTransition'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ShipNow - Hệ thống giao hàng thông minh',
  description: 'Nền tảng vận chuyển kết nối nhanh chóng và tối ưu chi phí',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/*
          PageTransition bọc toàn bộ children.
          Component này là 'use client' nên nhận biết được pathname change
          và áp dụng fade + slide-up animation mỗi khi chuyển trang.
        */}
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  )
}