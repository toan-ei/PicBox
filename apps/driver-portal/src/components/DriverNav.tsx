'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, Package, User } from 'lucide-react'

const NAV = [
  { href: '/',        label: 'Tổng quan',   icon: Home },
  { href: '/routes',  label: 'Lộ trình',    icon: Map },
  { href: '/trips',   label: 'Chuyến hàng', icon: Package },
  { href: '/profile', label: 'Tài khoản',   icon: User },
]

export default function DriverNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-900 border-t border-gray-800 flex z-50">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              active ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'
            }`}>
            <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}