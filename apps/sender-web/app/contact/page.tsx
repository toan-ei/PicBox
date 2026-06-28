'use client'

import { useState } from 'react'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import LandingHeader from '@/components/layout/LandingHeader'
import {
  Phone, Mail, MapPin, Clock, MessageCircle,
  Send, CheckCircle, Facebook, ArrowRight
} from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', phone: '', email: '', service: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Liên hệ & Tư vấn
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chúng tôi luôn sẵn sàng <span className="text-blue-600">hỗ trợ bạn</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Gửi yêu cầu tư vấn hoặc liên hệ trực tiếp — đội ngũ ShipNow phản hồi trong vòng 30 phút.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left — info */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin liên hệ</h2>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: Phone,   label: 'Hotline',        value: '0392 485 227' },
                    { icon: Mail,    label: 'Email',           value: 'ducviet0504@gmail.com' },
                    { icon: MapPin,  label: 'Trụ sở chính',   value: '70 Tô Ký, P.Trung Mỹ Tây, Q.12, TP.HCM' },
                    { icon: Clock,   label: 'Giờ làm việc',   value: 'T2–T7: 8:00–22:00 | CN: 9:00–18:00' },
                  ].map(c => {
                    const Icon = c.icon
                    return (
                      <div key={c.label} className="flex gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{c.label}</p>
                          <p className="text-sm text-gray-800 mt-0.5">{c.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick contact */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Liên hệ nhanh</h3>
                <div className="flex flex-col gap-2">
                  <a href="tel:0392485227"
                    className="flex items-center gap-2.5 py-2.5 px-4 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Phone size={15} /> Gọi ngay: 0392 485 227
                  </a>
                  <a href="https://zalo.me/392485227" target="_blank" rel="noreferrer"
                    className="flex items-center gap-2.5 py-2.5 px-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                    <MessageCircle size={15} /> Nhắn Zalo
                  </a>
                  <a href="https://www.facebook.com/le.ngoc.uc.viet?locale=vi_VN" target="_blank" rel="noreferrer"
                    className="flex items-center gap-2.5 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                    <Facebook size={15} /> Facebook Messenger
                  </a>
                </div>
              </div>

              {/* MAP COMPONENT THAY THẾ TẠI ĐÂY */}
              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="h-48 w-full bg-gray-100 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.474928892188!2d106.62354607573678!3d10.851437457805178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752a16d8471b4b%3A0xe67c13da8da4b3bf!2zNzAgVMO0IEvDvSwgVHJ1bmcgTeG7uSBUw6F5LCBRdeG6rW4gMTIsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1711900000000!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ShipNow Office Location"
                    className="absolute inset-0"
                  />
                </div>
                <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-2">
                  <MapPin size={14} className="text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-gray-500 font-medium">70 Tô Ký, P.Trung Mỹ Tây, Q.12, TP.HCM</p>
                </div>
              </div>

            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8">
                {sent ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={30} className="text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Gửi thành công!</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng <strong>30 phút</strong>.
                    </p>
                    <button onClick={() => setSent(false)}
                      className="text-blue-600 text-sm hover:underline">
                      Gửi yêu cầu khác
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Gửi yêu cầu tư vấn</h2>
                    <p className="text-sm text-gray-500 mb-6">Điền thông tin bên dưới, chúng tôi sẽ liên hệ trong vòng 30 phút</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">Họ tên <span className="text-red-500">*</span></label>
                          <input type="text" required
                            value={form.name}
                            placeholder="Nguyễn Văn A"
                            onChange={e => setForm({...form, name: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                          <input type="tel" required
                            value={form.phone}
                            placeholder="0901234567"
                            onChange={e => setForm({...form, phone: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
                        <input type="email"
                          value={form.email}
                          placeholder="email@example.com"
                          onChange={e => setForm({...form, email: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">Dịch vụ quan tâm</label>
                        <select
                          value={form.service}
                          onChange={e => setForm({...form, service: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                          <option value="">-- Chọn dịch vụ --</option>
                          <option>Giao hàng Tiêu chuẩn</option>
                          <option>Giao hàng Nhanh</option>
                          <option>Giao trong ngày</option>
                          <option>Hàng Cồng Kềnh</option>
                          <option>Hàng Tươi Sống</option>                
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">Nội dung</label>
                        <textarea
                          rows={4}
                          value={form.message}
                          placeholder="Mô tả nhu cầu giao hàng của bạn..."
                          onChange={e => setForm({...form, message: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                      </div>

                      <button type="submit"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                        <Send size={16} /> Gửi yêu cầu tư vấn
                      </button>

                      <p className="text-xs text-gray-400 text-center">
                        Bằng cách gửi form, bạn đồng ý với{' '}
                        <Link href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</Link> của ShipNow
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}