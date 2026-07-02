'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Home, Map, ArrowLeftRight, User, Menu, X, Truck } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',        label: 'Tổng quan',   icon: Home },
  { href: '/routes',  label: 'Lộ trình',    icon: Map },
  { href: '/trips',   label: 'Chuyến hàng', icon: ArrowLeftRight },
  { href: '/profile', label: 'Tài khoản',   icon: User },
]

export default function DriverSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: MouseEvent) => {
      const el = document.getElementById('driver-sidebar-panel')
      if (el && !el.contains(e.target as Node)) setMobileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  const NavList = () => (
    <nav className="flex-1 p-3 flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent'
            }`}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2.5 : 1.5}
              className={isActive ? 'text-emerald-400' : ''}
            />
            <span>{label}</span>
            {isActive && (
              <span
                className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400"
                style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* ===== DESKTOP sidebar ===== */}
      <aside
        className="hidden md:flex w-56 min-h-screen flex-col flex-shrink-0"
        style={{
          background: 'rgba(2, 12, 7, 0.98)',
          borderRight: '1px solid rgba(52, 211, 153, 0.10)',
        }}
      >
        {/* Logo */}
        <div
          className="h-14 flex items-center px-5"
          style={{ borderBottom: '1px solid rgba(52, 211, 153, 0.08)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(52, 211, 153, 0.15)' }}
            >
              <Truck size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">ShipNow</p>
              <p className="text-[9px] text-emerald-500/70 font-semibold uppercase tracking-widest leading-tight">
                Driver
              </p>
            </div>
          </div>
        </div>

        <NavList />

        {/* Bottom badge */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(52, 211, 153, 0.06)' }}>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(52, 211, 153, 0.06)' }}
          >
            <span
              className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"
              style={{ boxShadow: '0 0 6px rgba(52,211,153,0.6)' }}
            />
            <span className="text-[11px] text-emerald-400 font-semibold">Đang hoạt động</span>
          </div>
        </div>
      </aside>

      {/* ===== MOBILE: hamburger ===== */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-40 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200"
      >
        <Menu size={22} />
      </button>

      {/* ===== MOBILE: overlay ===== */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
      )}

      {/* ===== MOBILE: sidebar panel ===== */}
      <aside
        id="driver-sidebar-panel"
        className={`md:hidden fixed top-0 left-0 h-full w-64 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'rgba(2, 12, 7, 0.99)',
          borderRight: '1px solid rgba(52, 211, 153, 0.12)',
        }}
      >
        <div
          className="h-14 flex items-center justify-between px-5"
          style={{ borderBottom: '1px solid rgba(52, 211, 153, 0.08)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(52, 211, 153, 0.15)' }}
            >
              <Truck size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">ShipNow</p>
              <p className="text-[9px] text-emerald-500/70 font-semibold uppercase tracking-widest">Driver</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-slate-600 hover:text-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <NavList />
      </aside>
    </>
  )
}