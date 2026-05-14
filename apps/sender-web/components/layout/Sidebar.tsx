'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  Wallet,
  Settings,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/orders',     label: 'Đơn hàng',    icon: Package },
  { href: '/orders/new', label: 'Tạo đơn mới', icon: PackagePlus },
  { href: '/wallet',     label: 'Ví của tôi',  icon: Wallet },
  { href: '/settings',   label: 'Cài đặt',     icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="h-14 flex items-center px-5 border-b border-gray-200">
        <span className="font-bold text-blue-600 text-lg tracking-tight">ShipNow</span>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}