import Link from 'next/link'
import {
  Package, Truck, MapPin, Shield,
  Clock, BarChart3, ArrowRight,
  CheckCircle, Phone, Mail, Star
} from 'lucide-react'

const services = [
  {
    icon: Clock,
    title: 'Giao hàng tiêu chuẩn',
    desc: '2–3 ngày làm việc toàn quốc',
    price: 'Từ 22.000đ',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Truck,
    title: 'Giao hàng nhanh',
    desc: 'Giao ngay hôm sau trước 12h',
    price: 'Từ 35.000đ',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: MapPin,
    title: 'Giao trong ngày',
    desc: 'Nội thành HCM & Hà Nội, 4–6 tiếng',
    price: 'Từ 55.000đ',
    color: 'text-orange-600 bg-orange-50',
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
  const fadeInUp = "animate-[fadeInUp_0.6s_ease-out_both]"

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">ShipNow</span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#services" className="hover:text-blue-600 transition-colors">Dịch vụ</a>
            <a href="#benefits" className="hover:text-blue-600 transition-colors">Lợi ích</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Bảng giá</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Liên hệ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" target="_blank"
              className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Đăng nhập
            </Link>
            <Link href="/auth/register" target="_blank"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Đăng ký miễn phí
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left" style={{animation: 'fadeInUp 0.7s ease-out both'}}>
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
                <Link href="/auth/register" target="_blank"
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm">
                  Bắt đầu giao hàng miễn phí
                  <ArrowRight size={16} />
                </Link>
                <a href="#services"
                  className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 transition-colors text-sm">
                  Xem dịch vụ
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-4">Miễn phí đăng ký · Không phí ẩn · Hủy bất kỳ lúc nào</p>
            </div>

            {/* Mock App Preview */}
            <div className="flex-1 flex justify-center lg:justify-end" style={{animation: 'slideInRight 0.8s ease-out 0.2s both'}}>
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-full max-w-sm" style={{animation: 'float 4s ease-in-out infinite'}}>
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
              <div key={s.label} className="text-center" style={{animation: `fadeInUp 0.6s ease-out ${stats.indexOf(s) * 0.1}s both`}}>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-blue-200 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Dịch vụ giao hàng</h2>
            <p className="text-gray-500">Lựa chọn phù hợp với nhu cầu của bạn</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(s => {
              const Icon = s.icon
              return (
                <div key={s.title}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{s.desc}</p>
                  <p className="text-lg font-bold text-blue-600">{s.price}</p>
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

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Khách hàng nói gì?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-6">
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
            <Link href="/auth/register" target="_blank"
              className="flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Đăng ký miễn phí
              <ArrowRight size={16} />
            </Link>
            <a href="#contact"
              className="flex items-center justify-center gap-2 border border-blue-400 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors">
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </section>

      {/* Footer / Contact Section */}
      <section id="contact" className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <span className="text-xl font-bold text-white">ShipNow</span>
              <p className="text-gray-400 text-sm mt-2 max-w-xs">
                Nền tảng giao hàng thông minh, kết nối người gửi với đơn vị vận chuyển uy tín nhất.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-white">Liên hệ</p>
              <a href="tel:1900xxxx" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <Phone size={14} /> 1900 xxxx (8h–22h)
              </a>
              <a href="mailto:support@shipnow.vn" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <Mail size={14} /> support@shipnow.vn
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-white">Nhanh</p>
              <Link href="/auth/login" target="_blank" className="text-sm text-gray-400 hover:text-white transition-colors">Đăng nhập</Link>
              <Link href="/auth/register" target="_blank" className="text-sm text-gray-400 hover:text-white transition-colors">Đăng ký</Link>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center">
            <p className="text-xs text-gray-500">© 2026 ShipNow. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </section>

    </div>
  )
}