'use client'

import { useEffect, useState } from 'react'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
  Package, Truck, MapPin, Shield,
  Clock, BarChart3, ArrowRight,
  CheckCircle, Phone, Mail, Star,
  Send, MessageCircle, Globe, Headset,
  Zap, Snowflake
} from 'lucide-react'
import LandingHeader from '@/components/layout/LandingHeader'
import { getCurrentUser } from '@/lib/auth-service'

// ==========================================
// 1. CẬP NHẬT DATA DỊCH VỤ (THEO UI HÌNH 1)
// ==========================================
const servicesHome = [
  {
    id: 'standard',
    badge: 'Phổ biến nhất',
    badgeColor: 'bg-blue-100 text-blue-700',
    icon: Truck,
    iconColor: 'text-blue-600 bg-blue-50',
    title: 'Giao hàng Tiêu chuẩn',
    subtitle: 'ShipNow Standard',
    desc: 'Dịch vụ giao hàng toàn quốc với chi phí tối ưu, phù hợp cho mọi loại hàng hóa thông thường.',
    time: '2–3 ngày làm việc',
    price: 'Từ 22.000đ',
    cta: 'Tạo đơn tiêu chuẩn',
  },
  {
    id: 'fast',
    badge: 'Giao nhanh nhất',
    badgeColor: 'bg-violet-100 text-violet-700',
    icon: Zap,
    iconColor: 'text-violet-600 bg-violet-50',
    title: 'Giao hàng Nhanh',
    subtitle: 'ShipNow Fast',
    desc: 'Giao hàng ưu tiên, đảm bảo đến tay người nhận trước 12h ngày hôm sau.',
    time: 'Hôm sau trước 12h',
    price: 'Từ 35.000đ',
    cta: 'Tạo đơn nhanh',
  },
  {
    id: 'sameday',
    badge: 'Nội thành',
    badgeColor: 'bg-orange-100 text-orange-700',
    icon: Clock,
    iconColor: 'text-orange-600 bg-orange-50',
    title: 'Giao trong ngày',
    subtitle: 'ShipNow Same Day',
    desc: 'Giao hàng trong ngày cho khu vực nội thành TP.HCM và Hà Nội, lý tưởng cho shop thời trang, F&B.',
    time: '4–6 tiếng nội thành',
    price: 'Từ 55.000đ',
    cta: 'Tạo đơn trong ngày',
  },
  {
    id: 'bulky',
    badge: 'Hàng cồng kềnh',
    badgeColor: 'bg-green-100 text-green-700',
    icon: Package,
    iconColor: 'text-green-600 bg-green-50',
    title: 'Hàng Cồng Kềnh',
    subtitle: 'ShipNow Bulky',
    desc: 'Chuyên vận chuyển hàng nặng, kích thước lớn như nội thất, thiết bị điện tử, xe đạp, máy móc.',
    time: '3–5 ngày làm việc',
    price: 'Từ 80.000đ',
    cta: 'Tạo đơn hàng lớn',
  },
  {
    id: 'fresh',
    badge: 'Hàng tươi sống',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    icon: Snowflake,
    iconColor: 'text-cyan-600 bg-cyan-50',
    title: 'Hàng Tươi Sống',
    subtitle: 'ShipNow Fresh',
    desc: 'Vận chuyển thực phẩm tươi sống, đông lạnh với xe bảo ôn, đảm bảo chất lượng đến tay người nhận.',
    time: 'Giao trong ngày',
    price: 'Từ 65.000đ',
    cta: 'Tạo đơn tươi sống',
  },
]

// ==========================================
// 2. CẬP NHẬT DATA BẢNG GIÁ (THEO UI HÌNH 2)
// ==========================================
const servicesPricing = [
  {
    icon: Truck,
    iconColor: 'text-blue-600 bg-blue-50',
    title: 'Giao hàng Tiêu chuẩn',
    time: '2–3 ngày làm việc',
    price: 'Từ 22.000đ',
    priceColor: 'text-blue-600',
    highlights: [
      'Phủ sóng toàn bộ 34 tỉnh thành',
      'Lấy hàng tận nơi miễn phí',
      'Bảo hiểm hàng hóa 100%',
      'Theo dõi đơn hàng realtime',
    ],
  },
  {
    icon: Zap,
    iconColor: 'text-violet-600 bg-violet-50',
    title: 'Giao hàng Nhanh',
    time: 'Hôm sau trước 12h',
    price: 'Từ 35.000đ',
    priceColor: 'text-violet-600',
    highlights: [
      'Ưu tiên xử lý đơn hàng',
      'Lấy hàng trong vòng 2 tiếng',
      'Cam kết giao đúng giờ',
      'Hoàn tiền nếu trễ hạn',
    ],
  },
  {
    icon: Clock,
    iconColor: 'text-orange-600 bg-orange-50',
    title: 'Giao trong ngày',
    time: '4–6 tiếng nội thành',
    price: 'Từ 55.000đ',
    priceColor: 'text-orange-600',
    highlights: [
      'Nội thành HCM & Hà Nội',
      'Đặt trước 14h, giao trong ngày',
      'Shipper chuyên nghiệp, đồng phục',
      'Hỗ trợ đổi trả tại chỗ',
    ],
  },
  {
    icon: Package,
    iconColor: 'text-green-600 bg-green-50',
    title: 'Hàng Cồng Kềnh',
    time: '3–5 ngày làm việc',
    price: 'Từ 80.000đ',
    priceColor: 'text-green-600',
    highlights: [
      'Hàng > 30kg hoặc > 100x100cm',
      'Đóng gói chuyên nghiệp',
      'Xe tải chuyên dụng',
      'Bốc xếp tận nơi',
    ],
  },
  {
    icon: Snowflake,
    iconColor: 'text-cyan-600 bg-cyan-50',
    title: 'Hàng Tươi Sống',
    time: 'Giao trong ngày',
    price: 'Từ 65.000đ',
    priceColor: 'text-cyan-600',
    highlights: [
      'Xe bảo ôn chuyên dụng',
      'Duy trì nhiệt độ 0–5°C',
      'Giao trong 4–8 tiếng',
      'Phù hợp hải sản, rau củ, thịt',
    ],
  },
]

const benefits = [
  { icon: Shield, title: 'Bảo hiểm hàng hóa', desc: 'Bồi thường 100% giá trị nếu mất mát, hư hỏng' },
  { icon: MapPin, title: 'Theo dõi thời gian thực', desc: 'Cập nhật vị trí đơn hàng từng phút qua bản đồ' },
  { icon: BarChart3, title: 'Báo cáo chi tiết', desc: 'Thống kê doanh thu COD, tỷ lệ giao thành công' },
  { icon: CheckCircle, title: 'Mạng lưới toàn quốc', desc: 'Phủ sóng 34 tỉnh thành, giao tận nơi cấp xã' },
]

const stats = [
  { value: '2M+', label: 'Đơn hàng/tháng' },
  { value: '98%', label: 'Giao thành công' },
  { value: '34', label: 'Tỉnh thành' },
  { value: '4.8★', label: 'Đánh giá' },
]

const testimonials = [
  { name: 'Shop Thời Trang Linh', type: 'Shop Online', rating: 5, text: 'Giao hàng nhanh, ít hoàn hơn hẳn đơn vị cũ. Doanh thu tăng 30% sau khi chuyển sang ShipNow.' },
  { name: 'Nguyễn Văn Toan', type: 'Người bán cá nhân', rating: 5, text: 'Tạo đơn siêu nhanh, tài xế chuyên nghiệp. Ứng tiền COD trong ngày rất tiện.' },
  { name: 'Công ty TNHH ABC', type: 'Doanh nghiệp B2B', rating: 5, text: 'API tích hợp dễ, dashboard báo cáo đầy đủ. Đội hỗ trợ phản hồi nhanh.' },
]

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' })
  const [contactSent, setContactSent] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!getCurrentUser())
  }, [])

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.name.trim() || !contactForm.phone.trim()) return
    setContactSent(true)
    setContactForm({ name: '', phone: '', message: '' })
    setTimeout(() => setContactSent(false), 4000)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left" style={{ animation: 'fadeInUp 0.7s ease-out both' }}>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Nền tảng giao hàng thông minh tại Việt Nam
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Giao hàng nhanh,<br />
                <span className="text-blue-600">đơn giản & tiết kiệm</span>
              </h1>
              <p className="text-lg text-gray-500 mb-8 max-w-xl">
                Tạo đơn trong 30 giây, theo dõi thời gian thực, nhận COD ngay trong ngày.
                Phủ sóng toàn bộ 34 tỉnh thành Việt Nam.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                {isLoggedIn ? (
                  <Link href="/dashboard"
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm">
                    Vào Dashboard của bạn
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <Link href="/auth/register"
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm">
                    Bắt đầu giao hàng miễn phí
                    <ArrowRight size={16} />
                  </Link>
                )}
                <a href="#services"
                  className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 transition-colors text-sm">
                  Xem dịch vụ
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-4">Miễn phí đăng ký · Không phí ẩn · Hủy bất kỳ lúc nào</p>
            </div>

            {/* Mock App Preview */}
            <div className="flex-1 flex justify-center lg:justify-end" style={{ animation: 'slideInRight 0.8s ease-out 0.2s both' }}>
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-full max-w-sm" style={{ animation: 'float 4s ease-in-out infinite' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-gray-900">Dashboard ShipNow</span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">● Live</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Đơn hôm nay', value: '24', color: 'text-blue-600' },
                    { label: 'Đang giao', value: '8', color: 'text-yellow-600' },
                    { label: 'Thành công', value: '163', color: 'text-green-600' },
                    { label: 'COD chờ nhận', value: '2.4M', color: 'text-orange-600' },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { id: '#PB001', to: 'Quận 1, HCM', status: 'Đang giao', dot: 'bg-yellow-400' },
                    { id: '#PB002', to: 'Ba Đình, HN', status: 'Đã giao', dot: 'bg-green-500' },
                    { id: '#PB003', to: 'Hải Châu, ĐN', status: 'Chờ lấy', dot: 'bg-blue-500' },
                  ].map(o => (
                    <div key={o.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${o.dot}`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-blue-600">{o.id}</span>
                        <span className="text-xs text-gray-400 ml-1.5 truncate">→ {o.to}</span>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">{o.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-blue-200 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          SERVICES SECTION (THAY THẾ TOÀN BỘ THEO DESIGN HÌNH 1)
          ========================================================== */}
      <section id="services" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Các dịch vụ giao hàng</h2>
            <p className="text-gray-500">Đa dạng lựa chọn tối ưu, đáp ứng mọi nhu cầu kinh doanh của bạn</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesHome.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.id}
                  className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Badge & Icon Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.iconColor}`}>
                        <Icon size={22} />
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.badgeColor}`}>
                        {s.badge}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <p className="text-xs text-gray-400 mb-1">{s.subtitle}</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                      {s.desc}
                    </p>
                  </div>

                  {/* Footer Info & CTA */}
                  <div>
                    <div className="border-t border-dashed border-gray-100 pt-4 mb-5 flex justify-between items-center text-xs">
                      <div>
                        <p className="text-gray-400 mb-0.5">Thời gian</p>
                        <p className="font-bold text-gray-800">{s.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 mb-0.5">Chi phí</p>
                        <p className="font-bold text-blue-600 text-sm">{s.price}</p>
                      </div>
                    </div>

                    <Link
                      href={isLoggedIn ? "/dashboard" : "/auth/register"}
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {s.cta} <span className="text-base">→</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Tại sao chọn ShipNow?</h2>
            <p className="text-gray-500">Hơn 2 triệu đơn hàng tin tưởng mỗi tháng</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(b => {
              const Icon = b.icon
              return (
                <div key={b.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{b.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ==========================================================
          PRICING SECTION (THAY THẾ TOÀN BỘ THEO DESIGN HÌNH 2)
          ========================================================== */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Bảng giá cước chi tiết</h2>
            <p className="text-gray-500">Áp dụng cho hàng hóa thông thường dưới 5kg, chưa bao gồm VAT</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesPricing.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.title}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    {/* Service Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconColor}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{s.title}</h3>
                        <p className="text-xs text-gray-400">{s.time}</p>
                      </div>
                    </div>

                    {/* Big Price */}
                    <p className={`text-2xl font-bold mb-5 ${s.priceColor}`}>{s.price}</p>

                    {/* Highlights List */}
                    <ul className="flex flex-col gap-2.5 mb-6">
                      {s.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-xs text-gray-600 leading-tight">
                          <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={isLoggedIn ? "/dashboard" : "/auth/register"}
                    className="block w-full py-2.5 text-center border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all bg-white"
                  >
                    Dùng ngay
                  </Link>
                </div>
              )
            })}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            * Phụ phí vùng sâu/xa áp dụng thêm 5.000–15.000đ · Hàng &gt; 5kg tính thêm +5.000đ/kg
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Khách hàng nói gì?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Bắt đầu ngay hôm nay</h2>
          <p className="text-blue-200 mb-8">Đăng ký miễn phí, tạo đơn đầu tiên trong 2 phút</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isLoggedIn ? (
              <Link href="/dashboard"
                className="flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                Vào Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link href="/auth/register"
                className="flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                Đăng ký miễn phí
                <ArrowRight size={16} />
              </Link>
            )}
            <a href="#contact"
              className="flex items-center justify-center gap-2 border border-blue-400 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors">
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Liên hệ tư vấn</h2>
            <p className="text-gray-500">Để lại thông tin, đội ngũ ShipNow sẽ liên hệ tư vấn giải pháp giao hàng phù hợp</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Info Cards */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {[
                { icon: Headset, label: 'Hotline hỗ trợ', value: '0392 485 227', href: 'tel:0392485227' },
                { icon: Mail, label: 'Email', value: 'ducviet0504@gmail.com', href: 'mailto:ducviet0504@gmail.com' },
                { icon: Clock, label: 'Giờ làm việc', value: '8h00 – 22h00, hằng ngày' },
                { icon: Globe, label: 'Khu vực phục vụ', value: 'Toàn quốc — 34 tỉnh thành' },
              ].map(item => {
                const Icon = item.icon
                const content = (
                  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.value}</p>
                    </div>
                  </div>
                )
                return item.href ? (
                  <a key={item.label} href={item.href}>{content}</a>
                ) : (
                  <div key={item.label}>{content}</div>
                )
              })}

              <div className="flex gap-3 mt-2">
                <a href="tel:0392485227"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                  <Phone size={15} /> Gọi ngay
                </a>
                <a href="https://zalo.me/392485227" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:border-blue-300 hover:text-blue-600 transition-colors">
                  <MessageCircle size={15} /> Chat Zalo
                </a>
              </div>
            </div>

            {/* Right Lead Form */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Gửi yêu cầu</p>
              <h3 className="text-xl font-bold text-gray-900 mb-5">Đăng ký tư vấn miễn phí</h3>

              {contactSent ? (
                <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle size={26} className="text-green-500" />
                  </div>
                  <p className="font-semibold text-gray-900">Đã gửi yêu cầu thành công!</p>
                  <p className="text-sm text-gray-500 max-w-sm">
                    ShipNow sẽ liên hệ với bạn trong vòng 24h để tư vấn giải pháp phù hợp nhất.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Họ và tên <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={contactForm.name}
                        onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                        Số điện thoại <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0901234567"
                        value={contactForm.phone}
                        onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                      Bạn cần tư vấn gì?
                    </label>
                    <textarea
                      rows={4}
                      placeholder="VD: Em cần giải pháp giao hàng cho shop online, khoảng 50 đơn/ngày..."
                      value={contactForm.message}
                      onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors mt-1">
                    <Send size={15} />
                    Gửi yêu cầu tư vấn
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Bằng việc gửi yêu cầu, bạn đồng ý để ShipNow liên hệ tư vấn dịch vụ
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}