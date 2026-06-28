'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, User, Menu, X } from 'lucide-react'
import { getCurrentUser, logout } from '@/lib/auth-service'

const NAV_LINKS = [
  { href: '/',          label: 'Trang chủ' },
  { href: '/service',   label: 'Dịch vụ'   },
  { href: '/pricing',   label: 'Bảng giá'  },
  { href: '/about',     label: 'Giới thiệu'},
  { href: '/contact',   label: 'Liên hệ'   },
]

export default function LandingHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)
  const [checked, setChecked] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const navRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    setUser(getCurrentUser())
    setChecked(true)
  }, [])

  // Sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sliding active indicator
  useEffect(() => {
    const activeLink = linkRefs.current[pathname]
    if (!activeLink || !navRef.current) return
    const navRect = navRef.current.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    setIndicatorStyle({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      opacity: 1,
    })
  }, [pathname, checked])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    window.location.reload()
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/80'
            : 'bg-white/90 backdrop-blur border-b border-gray-100'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          {/* Logo — always links home */}
          <Link
            href="/"
            className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors shrink-0 select-none"
          >
            ShipNow
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} className="relative hidden md:flex items-center gap-1">
            {/* Sliding indicator */}
            <span
              className="absolute bottom-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity,
              }}
            />

            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={el => { linkRefs.current[link.href] = el }}
                  className={`relative px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/60'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: Auth buttons */}
          <div className="flex items-center gap-3">
            {!checked ? (
              <div className="w-40 h-9" />
            ) : user ? (
              <>
                <span className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600">
                  <User size={14} className="text-gray-400" />
                  {user.name}
                </span>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <LayoutDashboard size={14} />
                  Vào Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:block text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Đăng ký miễn phí
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-1 px-4 py-3 bg-white border-t border-gray-100">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            {!user && (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Page transition overlay — triggers on route change */}
      <PageTransitionOverlay />
    </>
  )
}

// ---- Page transition: fade + slide up ----
function PageTransitionOverlay() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const prevPathRef = useRef(pathname)

  useEffect(() => {
    if (prevPathRef.current === pathname) return
    prevPathRef.current = pathname

    // Flash the overlay briefly on route change
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 350)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9998] bg-white transition-opacity duration-300"
      style={{ opacity: visible ? 0.6 : 0 }}
    />
  )
}