'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'



const navItems = [
  
  { href: '/dashboard',        label: 'Dashboard',       icon: '📊' },
  { href: '/orders',           label: 'Đơn hàng',        icon: '📦' },
  { href: '/orders/new',       label: 'Tạo đơn mới',     icon: '➕' },
  { href: '/wallet',           label: 'Ví của tôi',      icon: '💳' },
  { href: '/settings',         label: 'Cài đặt',         icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="h-14 flex items-center px-4 border-b border-gray-200">
        <span className="font-semibold text-gray-900">ShipNow</span>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}