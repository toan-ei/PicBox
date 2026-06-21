'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, ChevronDown, Package, CheckCircle, X, Info, RefreshCw, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { logout, getCurrentUser } from '@/lib/auth-service'
import { getUserNotifications } from '@picbox/utils'
import type { NotificationItem } from '@picbox/utils'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':       'Dashboard',
  '/orders':          'Đơn hàng',
  '/orders/new':      'Tạo đơn mới',
  '/wallet':          'Ví của tôi',
  '/wallet/topup':    'Nạp tiền',
  '/wallet/history':  'Lịch sử giao dịch',
  '/settings':        'Cài đặt',
}

const NOTIF_CFG: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  ORDER_CREATED:        { icon: Package,     color: 'text-blue-500',   bg: 'bg-blue-50',   label: 'Đơn mới' },
  ORDER_STATUS_CHANGED: { icon: Bell,        color: 'text-indigo-500', bg: 'bg-indigo-50', label: 'Cập nhật' },
  ORDER_CANCELLED:      { icon: X,           color: 'text-red-500',    bg: 'bg-red-50',    label: 'Huỷ đơn' },
  PAYMENT_SUCCESS:      { icon: CheckCircle, color: 'text-green-500',  bg: 'bg-green-50',  label: 'Thanh toán' },
  GENERIC:              { icon: Info,        color: 'text-gray-400',   bg: 'bg-gray-50',   label: 'Thông báo' },
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now.getTime() - d.getTime()) / 1000
  if (diff < 60) return 'Vừa xong'
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showMenu, setShowMenu]     = useState(false)
  const [bellOpen, setBellOpen]     = useState(false)
  const [notifs, setNotifs]         = useState<NotificationItem[]>([])
  const [nLoading, setNLoading]     = useState(false)
  const [nLoaded, setNLoaded]       = useState(false)
  const [user, setUser]             = useState<{ id: string; name: string; email: string; phone: string } | null>(null)

  const bellRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const fetchNotifs = useCallback(async () => {
    if (!user?.id) return
    setNLoading(true)
    const data = await getUserNotifications(user.id)
    setNotifs(data)
    setNLoading(false)
    setNLoaded(true)
  }, [user?.id])

  useEffect(() => {
    if (bellOpen && !nLoaded && user?.id) fetchNotifs()
  }, [bellOpen, nLoaded, fetchNotifs, user?.id])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
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

        {/* Bell dropdown */}
        <div ref={bellRef} className="relative">
          <button
            type="button"
            aria-label="Thông báo"
            onClick={() => setBellOpen(v => !v)}
            className="relative w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={18} />
            {(notifs.length > 0 || !nLoaded) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Bell size={13} className="text-blue-500" />
                  <span className="text-sm font-semibold text-gray-900">Thông báo</span>
                  {notifs.length > 0 && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">
                      {notifs.length}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  title="Tải lại"
                  onClick={(e) => { e.stopPropagation(); fetchNotifs() }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <RefreshCw size={13} className={nLoading ? 'animate-spin' : ''} />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-72 overflow-y-auto">
                {nLoading ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                    <Loader2 size={15} className="animate-spin" />
                    <span className="text-sm">Đang tải...</span>
                  </div>
                ) : notifs.length === 0 ? (
                  <div className="py-10 text-center text-gray-400">
                    <Bell size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Chưa có thông báo nào</p>
                    <p className="text-xs mt-0.5 text-gray-300">Thông báo đơn hàng sẽ xuất hiện ở đây</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notifs.slice(0, 8).map(n => {
                      const cfg = NOTIF_CFG[n.type] ?? NOTIF_CFG.GENERIC
                      const Icon = cfg.icon
                      return (
                        <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                            <Icon size={13} className={cfg.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate leading-snug">{n.subject}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{n.body}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-4 py-2.5">
                <Link
                  href="/wallet"
                  onClick={() => setBellOpen(false)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Xem tất cả trong ví của tôi →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={menuRef} className="relative">
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
          )}
        </div>
      </div>
    </header>
  )
}
