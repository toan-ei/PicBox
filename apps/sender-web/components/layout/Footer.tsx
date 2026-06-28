import Link from 'next/link'
import { Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-gray-800">

          {/* Brand */}
          <div>
            <span className="text-xl font-bold text-white">ShipNow</span>
            <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
              Nền tảng giao hàng thông minh, kết nối người gửi với đơn vị vận chuyển uy tín nhất.
            </p>
          </div>

          {/* Liên hệ */}
          <div>
            <p className="text-sm font-semibold text-white mb-4">Liên hệ</p>
            <div className="flex flex-col gap-3">
              <a href="tel:0392485227"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <Phone size={14} /> 0392 485 227
              </a>
              <a href="mailto:ducviet0504@gmail.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <Mail size={14} /> ducviet0504@gmail.com
              </a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <p className="text-sm font-semibold text-white mb-4">Liên kết nhanh</p>
            <div className="flex flex-col gap-2">
              <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">Đăng nhập</Link>
              <Link href="/auth/register" className="text-sm text-gray-400 hover:text-white transition-colors">Đăng ký</Link>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">Dịch vụ</Link>
              <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Bảng giá</Link>
              <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">Giới thiệu</Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Liên hệ</Link>
            </div>
          </div>
        </div>

        <div className="pt-6 text-center">
          <p className="text-xs text-gray-500">© 2026 ShipNow. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  )
}