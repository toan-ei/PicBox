'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, LogOut, User } from 'lucide-react'
import { getCurrentUser, logout } from '@/lib/auth-service'

export default function LandingHeader() {
  // null = chưa biết (đang đọc localStorage), undefined-like ban đầu để tránh hiện sai lúc hydrate
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setUser(getCurrentUser())
    setChecked(true)
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    window.location.reload()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold text-blue-600">ShipNow</span>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#services" className="hover:text-blue-600 transition-colors">Dịch vụ</a>
          <a href="#benefits" className="hover:text-blue-600 transition-colors">Lợi ích</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Bảng giá</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Liên hệ</a>
        </nav>

        {/* Tránh nháy UI lúc đầu — chỉ hiện khi đã đọc xong localStorage */}
        {!checked ? (
          <div className="w-40 h-9" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600">
              <User size={14} className="text-gray-400" />
              {user.name}
            </span>
            <Link href="/dashboard"
              className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <LayoutDashboard size={14} />
              Vào Dashboard
            </Link>
            <button onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1">
              <LogOut size={14} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/auth/login"
              className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Đăng nhập
            </Link>
            <Link href="/auth/register"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Đăng ký miễn phí
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}