'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Package, PackagePlus,
  Wallet, Settings, Menu, X
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/orders',      label: 'Đơn hàng',     icon: Package },
  { href: '/orders/new',  label: 'Tạo đơn mới',  icon: PackagePlus },
  { href: '/wallet',      label: 'Ví của tôi',   icon: Wallet },
  { href: '/settings',    label: 'Cài đặt',      icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Đóng sidebar khi chuyển trang trên mobile
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Đóng khi click ra ngoài
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: MouseEvent) => {
      const sidebar = document.getElementById('sidebar-panel')
      if (sidebar && !sidebar.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  const NavList = () => (
    <nav className="flex-1 p-3 flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <Link key={href} href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* ===== DESKTOP sidebar (md trở lên) ===== */}
      <aside className="hidden md:flex w-56 min-h-screen bg-white border-r border-gray-200 flex-col flex-shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-gray-200">
          <Link href="/" className="font-bold text-blue-600 text-lg tracking-tight">ShipNow</Link>
        </div>
        <NavList />
      </aside>

      {/* ===== MOBILE: hamburger button (nằm trong Navbar) ===== */}
      <button
        id="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-40 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
      >
        <Menu size={22} />
      </button>

      {/* ===== MOBILE: overlay ===== */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity" />
      )}

      {/* ===== MOBILE: sidebar panel ===== */}
      <aside
        id="sidebar-panel"
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 flex flex-col shadow-xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-14 flex items-center justify-between px-5 border-b border-gray-200">
          <Link href="/" className="font-bold text-blue-600 text-lg">ShipNow</Link>
          <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <NavList />
      </aside>
    </>
  )
}