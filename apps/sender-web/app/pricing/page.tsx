import Link from 'next/link'
import LandingHeader from '@/components/layout/LandingHeader'
import Footer from '@/components/layout/Footer'
import { Truck, Zap, Clock, Globe, Snowflake, Package, CheckCircle, ArrowRight, Phone } from 'lucide-react'

const services = [
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

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Bảng giá minh bạch
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Giá rõ ràng, <span className="text-blue-600">không phí ẩn</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Chọn gói phù hợp với nhu cầu của bạn. Nâng cấp hoặc hủy bất kỳ lúc nào.
          </p>
        </div>
      </section>

      {/* Service pricing cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Cước phí theo dịch vụ</h2>
          <p className="text-gray-500 text-center text-sm mb-10">Áp dụng cho hàng hóa thông thường dưới 5kg, chưa bao gồm VAT</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(s => {
              const Icon = s.icon
              return (
                <div key={s.title}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconColor}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{s.title}</h3>
                      <p className="text-xs text-gray-400">{s.time}</p>
                    </div>
                  </div>
                  <p className={`text-2xl font-bold mb-4 ${s.priceColor}`}>{s.price}</p>
                  <ul className="flex flex-col gap-2 mb-5">
                    {s.highlights.map(h => (
                      <li key={h} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register"
                    className="block w-full py-2 text-center border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors">
                    Dùng ngay
                  </Link>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            * Phụ phí vùng sâu/xa áp dụng thêm 5.000–15.000đ · Hàng &gt; 5kg tính thêm +5.000đ/kg
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Câu hỏi thường gặp</h2>
          <div className="flex flex-col gap-4">
            {[
              { q: 'Có phí đăng ký không?', a: 'Hoàn toàn miễn phí. Bạn chỉ trả phí vận chuyển khi tạo đơn thành công.' },
              { q: 'COD được thanh toán trong bao lâu?', a: 'Tiền COD thu hộ sẽ được chuyển vào ví ShipNow trong vòng 1–2 ngày làm việc sau khi đơn được giao thành công.' },
              { q: 'Hàng hóa có được bảo hiểm không?', a: 'Có. Tất cả đơn hàng được bảo hiểm 100% giá trị khai báo. Bồi thường trong vòng 5 ngày làm việc nếu mất mát do lỗi vận chuyển.' },
              { q: 'Có thể hủy đơn sau khi tạo không?', a: 'Bạn có thể hủy đơn miễn phí trước khi shipper đến lấy hàng. Sau khi lấy hàng, phí hủy đơn là 15.000đ.' },
            ].map(faq => (
              <div key={faq.q} className="bg-gray-50 rounded-xl p-5">
                <p className="font-semibold text-gray-900 text-sm mb-2">{faq.q}</p>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-blue-600">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Cần tư vấn thêm?</h2>
          <p className="text-blue-200 text-sm mb-6">Đội ngũ hỗ trợ sẵn sàng tư vấn miễn phí cho bạn</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/contact"
              className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              <Phone size={15} /> Liên hệ tư vấn
            </Link>
            <Link href="/auth/register"
              className="flex items-center gap-2 border border-white text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-500 transition-colors">
              Đăng ký miễn phí <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}