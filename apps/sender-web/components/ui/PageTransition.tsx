'use client'

import { usePathname } from 'next/navigation'

/**
 * Chỉ fade-in trang mới khi pathname thay đổi.
 * Không giữ children cũ (gây flicker), không dùng display:none.
 * Key thay đổi → React unmount/mount → CSS animation chạy lại.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="page-transition-enter">
      {children}
    </div>
  )
}