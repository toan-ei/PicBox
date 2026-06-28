import Link from 'next/link'
import LandingHeader from '@/components/layout/LandingHeader'
import Footer from '@/components/layout/Footer'
import { Truck, Zap, Clock, Globe, Snowflake, Package, ArrowRight, CheckCircle } from 'lucide-react'

const services = [
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

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      <section className="pt-28 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            6 dịch vụ vận chuyển
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dịch vụ giao hàng <span className="text-blue-600">toàn diện</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Từ giao hàng tiêu chuẩn đến hàng tươi sống, hàng cồng kềnh hay quốc tế — ShipNow có giải pháp phù hợp cho mọi nhu cầu.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(s => {
              const Icon = s.icon
              return (
                <div key={s.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconColor}`}>
                      <Icon size={22} />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium mb-1">{s.subtitle}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 mb-5 flex-1">{s.desc}</p>
                  <div className="bg-gray-50 rounded-xl p-3 mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Thời gian</p>
                      <p className="text-sm font-semibold text-gray-800">{s.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Chi phí</p>
                      <p className="text-sm font-bold text-blue-600">{s.price}</p>
                    </div>
                  </div>
                  <Link href="/auth/register"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                    {s.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-blue-600">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Bắt đầu giao hàng ngay</h2>
          <p className="text-blue-200 text-sm mb-6">Đăng ký miễn phí, không phí ẩn, hủy bất kỳ lúc nào</p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors text-sm">
            Đăng ký miễn phí <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}