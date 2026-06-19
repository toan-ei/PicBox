'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { logout, getCurrentUser } from '@/lib/auth-service'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':       'Dashboard',
  '/orders':          'Đơn hàng',
  '/orders/new':      'Tạo đơn mới',
  '/wallet':          'Ví của tôi',
  '/wallet/topup':    'Nạp tiền',
  '/wallet/history':  'Lịch sử giao dịch',
  '/settings':        'Cài đặt',
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const title = PAGE_TITLES[pathname] ?? 'ShipNow'
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
    : '?'

  const handleLogout = async () => {
    setShowMenu(false)
    await logout()
    router.push('/auth/login')
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between flex-shrink-0 relative">
      {/* Mobile: space cho hamburger button */}
      <div className="w-8 md:hidden" />

      {/* Title */}
      <span className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 text-sm font-semibold text-gray-800 md:text-gray-500 md:font-normal">
        {title}
      </span>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          aria-label="Thông báo"
          className="relative w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label="Menu tài khoản"
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
              {initials}
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden="true"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name ?? '—'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email ?? ''}</p>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cài đặt tài khoản
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
