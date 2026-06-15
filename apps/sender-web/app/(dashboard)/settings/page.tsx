'use client'

import { useState } from 'react'
import {
  User, Building2, Bell, Shield,
  Key, ChevronRight, Camera, Check,
  Eye, EyeOff, Copy, CheckCheck
} from 'lucide-react'

type Tab = 'profile' | 'business' | 'notifications' | 'security' | 'api'

const TABS = [
  { id: 'profile',       label: 'Hồ sơ cá nhân', icon: User },
  { id: 'business',      label: 'Thông tin doanh nghiệp', icon: Building2 },
  { id: 'notifications', label: 'Thông báo', icon: Bell },
  { id: 'security',      label: 'Bảo mật', icon: Shield },
  { id: 'api',           label: 'API Key (B2B)', icon: Key },
] as const

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showOldPw, setShowOldPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  const [profile, setProfile] = useState({
    name: 'Nguyễn Đức Vĩ', email: 'ducvi@email.com',
    phone: '0901234567', address: 'Quận 1, TP. Hồ Chí Minh',
  })

  const [business, setBusiness] = useState({
    companyName: 'Shop Thời Trang Vĩ', taxCode: '',
    businessAddress: '', website: '',
  })

  const [notifications, setNotifications] = useState({
    orderCreated: true, orderDelivered: true,
    orderFailed: true, orderReturned: true,
    codReceived: true, promotions: false,
    sms: true, email: true, push: true,
  })

  const [passwords, setPasswords] = useState({
    old: '', new: '', confirm: ''
  })
  const [pwError, setPwError] = useState('')

  const apiKey = 'sk-picbox-2026-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleChangePw = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      setPwError('Mật khẩu xác nhận không khớp!')
      return
    }
    if (passwords.new.length < 6) {
      setPwError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    setPwError('')
    setSaved(true)
    setPasswords({ old: '', new: '', confirm: '' })
    setTimeout(() => setSaved(false), 2000)
  }

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
        <p className="text-sm text-gray-500 mt-0.5">Quản lý hồ sơ và tuỳ chọn tài khoản</p>
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">

        {/* Sidebar tabs */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {TABS.map(t => {
              const Icon = t.icon
              return (
                <button key={t.id} onClick={() => setTab(t.id as Tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-b border-gray-50 last:border-0 ${
                    tab === t.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  <Icon size={16} />
                  <span className="flex-1">{t.label}</span>
                  {tab === t.id && <ChevronRight size={14} />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">

          {/* Profile */}
          {tab === 'profile' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                    {profile.name.charAt(0)}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{profile.name}</p>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Họ tên', key: 'name', type: 'text', placeholder: 'Nguyễn Văn A' },
                  { label: 'Số điện thoại', key: 'phone', type: 'tel', placeholder: '0901234567' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'email@example.com' },
                  { label: 'Địa chỉ', key: 'address', type: 'text', placeholder: 'Quận 1, TP.HCM' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      value={profile[f.key as keyof typeof profile]}
                      placeholder={f.placeholder}
                      onChange={e => setProfile({...profile, [f.key]: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  {saved ? <><Check size={15} /> Đã lưu!</> : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          )}

          {/* Business */}
          {tab === 'business' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Thông tin doanh nghiệp</p>
                <p className="text-xs text-gray-500 mt-0.5">Dùng cho xuất hoá đơn VAT và hợp đồng B2B</p>
              </div>
              {[
                { label: 'Tên doanh nghiệp / Shop', key: 'companyName', placeholder: 'Shop Thời Trang ABC' },
                { label: 'Mã số thuế', key: 'taxCode', placeholder: '0123456789' },
                { label: 'Địa chỉ doanh nghiệp', key: 'businessAddress', placeholder: 'Số 1 Nguyễn Huệ, Q1, TP.HCM' },
                { label: 'Website', key: 'website', placeholder: 'https://shopabe.vn' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={business[f.key as keyof typeof business]}
                    placeholder={f.placeholder}
                    onChange={e => setBusiness({...business, [f.key]: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                <button onClick={handleSave}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  {saved ? <><Check size={15} /> Đã lưu!</> : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {tab === 'notifications' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-5 overflow-hidden">
              <div>
                <p className="text-sm font-semibold text-gray-900">Tuỳ chọn thông báo</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sự kiện đơn hàng</p>
                <div className="flex flex-col gap-3">
                  {[
                    { key: 'orderCreated',   label: 'Đơn hàng mới được tạo' },
                    { key: 'orderDelivered', label: 'Giao hàng thành công' },
                    { key: 'orderFailed',    label: 'Giao hàng thất bại' },
                    { key: 'orderReturned', label: 'Đơn hoàn về' },
                    { key: 'codReceived',   label: 'Nhận tiền COD vào ví' },
                    { key: 'promotions',    label: 'Khuyến mãi & tin tức' },
                  ].map(n => (
                    <div key={n.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700">{n.label}</span>
                      <button
                        onClick={() => setNotifications({...notifications, [n.key]: !notifications[n.key as keyof typeof notifications]})}
                        className={`w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0 ${
                          notifications[n.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        style={{height: '22px', width: '40px'}}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          notifications[n.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Kênh nhận thông báo</p>
                <div className="flex flex-col gap-3">
                  {[
                    { key: 'sms',   label: 'SMS (đến số điện thoại đã đăng ký)' },
                    { key: 'email', label: 'Email' },
                    { key: 'push',  label: 'Thông báo đẩy (trình duyệt)' },
                  ].map(n => (
                    <div key={n.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700">{n.label}</span>
                      <button
                        onClick={() => setNotifications({...notifications, [n.key]: !notifications[n.key as keyof typeof notifications]})}
                        className={`relative flex-shrink-0 rounded-full transition-colors ${
                          notifications[n.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        style={{height: '22px', width: '40px'}}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          notifications[n.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  {saved ? <><Check size={15} /> Đã lưu!</> : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {tab === 'security' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Đổi mật khẩu</p>
                  <p className="text-xs text-gray-500 mt-0.5">Mật khẩu mới phải có ít nhất 6 ký tự</p>
                </div>
                <form onSubmit={handleChangePw} className="flex flex-col gap-3">
                  {[
                    { label: 'Mật khẩu hiện tại', key: 'old', show: showOldPw, toggle: () => setShowOldPw(!showOldPw) },
                    { label: 'Mật khẩu mới', key: 'new', show: showNewPw, toggle: () => setShowNewPw(!showNewPw) },
                    { label: 'Xác nhận mật khẩu mới', key: 'confirm', show: showNewPw, toggle: () => setShowNewPw(!showNewPw) },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                      <div className="relative">
                        <input
                          type={f.show ? 'text' : 'password'}
                          value={passwords[f.key as keyof typeof passwords]}
                          onChange={e => setPasswords({...passwords, [f.key]: e.target.value})}
                          placeholder="••••••••"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="button" onClick={f.toggle}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {f.show ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {pwError && <p className="text-red-500 text-xs">{pwError}</p>}
                  <div className="flex justify-end mt-1">
                    <button type="submit"
                      className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                        saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}>
                      {saved ? <><Check size={15} /> Đã đổi!</> : 'Đổi mật khẩu'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-sm font-semibold text-gray-900 mb-1">Phiên đăng nhập</p>
                <p className="text-xs text-gray-500 mb-4">Quản lý các thiết bị đang đăng nhập tài khoản</p>
                {[
                  { device: 'Chrome / Windows', location: 'TP. Hồ Chí Minh', time: 'Đang hoạt động', current: true },
                  { device: 'Safari / iPhone', location: 'TP. Hồ Chí Minh', time: '2 giờ trước', current: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        {s.device}
                        {s.current && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Hiện tại</span>}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.location} · {s.time}</p>
                    </div>
                    {!s.current && (
                      <button className="text-xs text-red-500 hover:text-red-700 font-medium">Đăng xuất</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Key */}
          {tab === 'api' && (
            <div className="flex flex-col gap-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-800 mb-1">⚠️ Tính năng dành cho tài khoản B2B</p>
                <p className="text-xs text-amber-700">API Key cho phép tích hợp hệ thống của bạn trực tiếp với ShipNow. Không chia sẻ key này với bất kỳ ai.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
                <p className="text-sm font-semibold text-gray-900">API Key của bạn</p>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                  <code className="flex-1 text-xs font-mono text-gray-700 truncate">
                    {showKey ? apiKey : '•'.repeat(40)}
                  </code>
                  <button onClick={() => setShowKey(!showKey)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                    {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={copyKey}
                    className="text-gray-400 hover:text-blue-600 flex-shrink-0 transition-colors">
                    {copied ? <CheckCheck size={15} className="text-green-500" /> : <Copy size={15} />}
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ví dụ sử dụng</p>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre">{`curl -X POST https://api.shipnow.vn/v1/orders \\
  -H "Authorization: Bearer ${showKey ? apiKey.slice(0,20)+'...' : 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{"receiver":"Nguyễn Văn A",...}'`}</pre>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors">
                    Tạo lại API Key
                  </button>
                  <a href="#" className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold text-center hover:bg-blue-700 transition-colors">
                    Xem tài liệu API
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}