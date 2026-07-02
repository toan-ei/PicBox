'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Bell, ChevronDown, LogOut, User, AlertTriangle } from 'lucide-react'
import { getAuthState } from '@picbox/utils'

const PAGE_TITLES: Record<string, string> = {
  '/':        'Tổng quan',
  '/routes':  'Lộ trình',
  '/trips':   'Chuyến hàng',
  '/profile': 'Tài khoản',
}

export default function DriverNavbar() {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  const [userName, setUserName] = useState('Tài xế')
  const [initials, setInitials] = useState('TX')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const auth = getAuthState()
    const name = auth.user?.fullName || 'Tài xế'
    setUserName(name)
    setInitials(
      name.split(' ').map((w: string) => w[0]).slice(-2).join('').toUpperCase()
    )
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const title = PAGE_TITLES[pathname] ?? 'ShipNow Driver'

  return (
    <header
      className="h-14 flex items-center justify-between px-4 md:px-6 flex-shrink-0 relative"
      style={{
        background: 'rgba(3, 15, 9, 0.98)',
        borderBottom: '1px solid rgba(52, 211, 153, 0.08)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Mobile: space for hamburger */}
      <div className="w-8 md:hidden" />

      {/* Page title */}
      <span className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 text-sm font-semibold text-slate-200 md:text-slate-400 md:font-normal">
        {title}
      </span>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-auto">

        {/* Bell */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-white/[0.05] text-slate-500 hover:text-slate-300"
        >
          <Bell size={18} />
          {/* Unread dot */}
          <span
            className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400"
            style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }}
          />
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(v => !v)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all hover:bg-white/[0.05] border border-transparent hover:border-emerald-500/10"
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-emerald-400 flex-shrink-0"
              style={{ background: 'rgba(52, 211, 153, 0.15)' }}
            >
              {initials}
            </div>
            <span className="hidden sm:block text-sm text-slate-300 font-medium max-w-[100px] truncate">
              {userName}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-600 transition-transform ${showMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden shadow-2xl z-50"
              style={{
                background: 'rgba(5, 20, 12, 0.98)',
                border: '1px solid rgba(52, 211, 153, 0.12)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* User info */}
              <div
                className="px-4 py-3"
                style={{ borderBottom: '1px solid rgba(52, 211, 153, 0.08)' }}
              >
                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    style={{ boxShadow: '0 0 5px rgba(52,211,153,0.7)' }}
                  />
                  <p className="text-[11px] text-emerald-400 font-medium">Đang hoạt động</p>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5">
                <button
                  onClick={() => { setShowMenu(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 transition-all text-left"
                >
                  <User size={15} />
                  Tài khoản của tôi
                </button>
                <button
                  onClick={() => { setShowMenu(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/[0.08] transition-all text-left"
                >
                  <AlertTriangle size={15} />
                  Báo sự cố
                </button>
                <div
                  className="my-1"
                  style={{ height: '1px', background: 'rgba(52, 211, 153, 0.06)' }}
                />
                <button
                  onClick={() => {
                    setShowMenu(false)
                    // TODO: logout driver
                    window.location.href = '/login'
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-white/[0.04] hover:text-slate-300 transition-all text-left"
                >
                  <LogOut size={15} />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}