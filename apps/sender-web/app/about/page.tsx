import Link from 'next/link'
import Footer from '@/components/layout/Footer'
import LandingHeader from '@/components/layout/LandingHeader'
import { ArrowRight, Target, Heart, Zap, Users, Package, TrendingUp, Star } from 'lucide-react'

const team = [
  { name: 'Lê Đức Toàn', role: 'Leader', exp: 'Sinh viên năm 3', avatar: 'DT' },
  { name: 'Lê Ngọc Đức Việt',   role: 'Member', exp: 'Sinh viên năm 4',   avatar: 'DV' },
  { name: 'Phan Hoàng Phúc',       role: 'Member', exp: 'Sinh viên năm 3',       avatar: 'HP' },
  { name: 'Đinh Quốc Trí',     role: 'Member', exp: 'Sinh viên năm 3',   avatar: 'QT' },
]

const values = [
  { icon: Target, title: 'Minh bạch',       desc: 'Giá rõ ràng, không phí ẩn, mọi giao dịch đều được ghi lại đầy đủ' },
  { icon: Heart,  title: 'Tận tâm',         desc: 'Đặt trải nghiệm khách hàng lên hàng đầu trong mọi quyết định' },
  { icon: Zap,    title: 'Đổi mới',         desc: 'Liên tục cải tiến công nghệ để mang lại trải nghiệm tốt nhất' },
  { icon: Users,  title: 'Cộng đồng',       desc: 'Đồng hành cùng hàng triệu người bán Việt Nam phát triển kinh doanh' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* Hero */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Về chúng tôi
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold mb-5 leading-tight">
            Kết nối người bán Việt Nam<br />với khách hàng toàn quốc
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            ShipNow ra đời với sứ mệnh giúp mọi người bán hàng — từ cá nhân đến doanh nghiệp — giao hàng nhanh hơn, rẻ hơn và thông minh hơn.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Package,    value: '2M+',  label: 'Đơn hàng/tháng' },
              { icon: Users,      value: '50K+', label: 'Khách hàng tin dùng' },
              { icon: TrendingUp, value: '98%',  label: 'Tỷ lệ giao thành công' },
              { icon: Star,       value: '4.8★', label: 'Đánh giá trung bình' },
            ].map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} className="text-center">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon size={18} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Sứ mệnh</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                Logistics không còn là rào cản với người bán Việt
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Chúng tôi tin rằng mọi người bán hàng — dù là cá nhân bán online hay doanh nghiệp B2B — đều xứng đáng được dùng công cụ logistics hiện đại, minh bạch và hiệu quả.
              </p>
              <p className="text-gray-500 leading-relaxed">
                ShipNow xây dựng nền tảng công nghệ giúp tối ưu hóa toàn bộ chuỗi giao nhận: từ lúc tạo đơn, lấy hàng, vận chuyển đến giao tay khách và thu tiền COD.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map(v => {
                const Icon = v.icon
                return (
                  <div key={v.title} className="bg-gray-50 rounded-2xl p-5">
                    <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                      <Icon size={16} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{v.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>     

      {/* Team */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đội ngũ sáng lập</h2>
            <p className="text-gray-500 text-sm">Những người đang xây dựng tương lai logistics Việt Nam</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {team.map(t => (
              <div key={t.name} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center mx-auto mb-2">
                  {t.avatar}
                </div>
                <p className="text-xs font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-blue-600 mt-0.5">{t.role}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}