'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Package, Truck, CheckCircle, MapPin } from 'lucide-react'

export default function TrackingIndexPage() {
  const router = useRouter()
  const [code, setCode] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (trimmed) router.push(`/tracking/${trimmed}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-blue-600 text-lg tracking-tight">ShipNow</Link>
          <Link href="/auth/login" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            Đăng nhập
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Tra cứu đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-2">Nhập mã vận đơn để theo dõi hành trình giao hàng</p>
        </div>

        <form onSubmit={handleSearch} className="w-full flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="VD: PB001234"
              className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                font-mono tracking-widest"
              autoFocus
            />
          </div>
          <button type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold
              hover:bg-blue-700 transition-colors">
            Tra cứu
          </button>
        </form>

        {/* Quick steps */}
        <div className="w-full grid grid-cols-3 gap-3">
          {[
            { icon: CheckCircle, label: 'Xác nhận', color: 'text-blue-500 bg-blue-50' },
            { icon: Truck,       label: 'Đang giao', color: 'text-orange-500 bg-orange-50' },
            { icon: MapPin,      label: 'Nhận hàng', color: 'text-green-500 bg-green-50' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2 ${color}`}>
                <Icon size={18} />
              </div>
              <p className="text-xs font-medium text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}