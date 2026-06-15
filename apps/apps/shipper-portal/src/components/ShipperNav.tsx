'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, DollarSign, User } from 'lucide-react'

const NAV = [
  { href: '/',         label: 'Trang chủ', icon: Home },
  { href: '/orders',   label: 'Đơn hàng',  icon: List },
  { href: '/earnings', label: 'Thu nhập',  icon: DollarSign },
  { href: '/profile',  label: 'Tài khoản', icon: User },
]

export default function ShipperNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-900 border-t border-gray-800 flex z-50">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              active ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'
            }`}>
            <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}