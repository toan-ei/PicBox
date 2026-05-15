'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home, ChevronRight, ArrowLeft, Package,
  MapPin, Phone, User, Banknote, Clock,
  CheckCircle, Truck, RotateCcw, XCircle,
  Copy, ExternalLink, AlertCircle
} from 'lucide-react'

// ---- Types ----
type OrderStatus =
  | 'pending' | 'confirmed' | 'picked_up' | 'in_transit'
  | 'at_hub' | 'out_for_delivery' | 'delivered'
  | 'failed' | 'returned' | 'cancelled'

interface TimelineEvent {
  status: string
  label: string
  time: string
  location?: string
  done: boolean
  active: boolean
}

// ---- Mock data (sau này thay bằng API call theo params.id) ----
const MOCK_ORDERS: Record<string, {
  id: string
  trackingCode: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  serviceType: string
  estimatedDelivery: string
  sender: { name: string; phone: string; address: string }
  receiver: { name: string; phone: string; address: string; province: string }
  package: { weight: number; description: string; value: number }
  codAmount: number
  shippingFee: number
  paymentSide: 'sender' | 'receiver'
  note: string
  timeline: TimelineEvent[]
}> = {
  '1': {
    id: '1', trackingCode: 'PB001234', status: 'out_for_delivery',
    createdAt: '15/05/2026 08:00', updatedAt: '15/05/2026 14:30',
    serviceType: 'Nhanh', estimatedDelivery: '15/05/2026',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Nguyễn Văn A', phone: '0901234567', address: '45 Trần Hưng Đạo', province: 'Quận 5, TP.HCM' },
    package: { weight: 1.5, description: 'Quần áo', value: 350000 },
    codAmount: 250000, shippingFee: 35000, paymentSide: 'receiver',
    note: 'Gọi trước khi giao',
    timeline: [
      { status: 'confirmed', label: 'Đơn hàng được xác nhận', time: '15/05/2026 08:05', location: 'Hệ thống', done: true, active: false },
      { status: 'picked_up', label: 'Shipper đã lấy hàng', time: '15/05/2026 10:20', location: 'Quận 1, TP.HCM', done: true, active: false },
      { status: 'at_hub', label: 'Hàng đến bưu cục', time: '15/05/2026 11:45', location: 'Hub Q.1 - TP.HCM', done: true, active: false },
      { status: 'out_for_delivery', label: 'Đang giao đến người nhận', time: '15/05/2026 13:30', location: 'Quận 5, TP.HCM', done: true, active: true },
      { status: 'delivered', label: 'Giao hàng thành công', time: '—', location: '', done: false, active: false },
    ],
  },
  '2': {
    id: '2', trackingCode: 'PB001235', status: 'delivered',
    createdAt: '14/05/2026 09:00', updatedAt: '15/05/2026 14:30',
    serviceType: 'Tiêu chuẩn', estimatedDelivery: '15/05/2026',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Trần Thị B', phone: '0912345678', address: '22 Hai Bà Trưng', province: 'Quận 3, TP.HCM' },
    package: { weight: 0.5, description: 'Mỹ phẩm', value: 0 },
    codAmount: 0, shippingFee: 20000, paymentSide: 'sender',
    note: '',
    timeline: [
      { status: 'confirmed', label: 'Đơn hàng được xác nhận', time: '14/05/2026 09:10', location: 'Hệ thống', done: true, active: false },
      { status: 'picked_up', label: 'Shipper đã lấy hàng', time: '14/05/2026 11:00', location: 'Quận 1, TP.HCM', done: true, active: false },
      { status: 'at_hub', label: 'Hàng đến bưu cục', time: '14/05/2026 13:00', location: 'Hub Q.1 - TP.HCM', done: true, active: false },
      { status: 'out_for_delivery', label: 'Đang giao đến người nhận', time: '15/05/2026 08:00', location: 'Quận 3, TP.HCM', done: true, active: false },
      { status: 'delivered', label: 'Giao hàng thành công', time: '15/05/2026 14:30', location: 'Quận 3, TP.HCM', done: true, active: true },
    ],
  },
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:          { label: 'Chờ xác nhận',     color: 'bg-gray-100 text-gray-600',    icon: Clock },
  confirmed:        { label: 'Đã xác nhận',       color: 'bg-blue-100 text-blue-700',    icon: CheckCircle },
  picked_up:        { label: 'Đã lấy hàng',       color: 'bg-indigo-100 text-indigo-700',icon: Package },
  in_transit:       { label: 'Đang vận chuyển',   color: 'bg-purple-100 text-purple-700',icon: Truck },
  at_hub:           { label: 'Tại bưu cục',       color: 'bg-orange-100 text-orange-700',icon: Package },
  out_for_delivery: { label: 'Đang giao',         color: 'bg-cyan-100 text-cyan-700',    icon: Truck },
  delivering:       { label: 'Đang giao',         color: 'bg-cyan-100 text-cyan-700',    icon: Truck },
  delivered:        { label: 'Đã giao',           color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  failed:           { label: 'Giao thất bại',     color: 'bg-red-100 text-red-700',      icon: XCircle },
  returned:         { label: 'Hoàn hàng',         color: 'bg-rose-100 text-rose-700',    icon: RotateCcw },
  cancelled:        { label: 'Đã huỷ',            color: 'bg-gray-100 text-gray-400',    icon: XCircle },
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-32 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 font-medium flex-1">{children}</span>
    </div>
  )
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const order = MOCK_ORDERS[params.id as string]

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <AlertCircle size={40} className="text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-700">Không tìm thấy đơn hàng</h2>
        <p className="text-sm text-gray-400">Mã đơn không tồn tại hoặc đã bị xoá</p>
        <Link href="/orders"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Về danh sách đơn
        </Link>
      </div>
    )
  }

  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG['pending']
  const StatusIcon = statusCfg.icon
  const totalCollect = order.paymentSide === 'receiver'
    ? order.codAmount + order.shippingFee
    : order.codAmount

  const copyTracking = () => {
    navigator.clipboard.writeText(order.trackingCode)
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/dashboard"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
          <Home size={12} /> Trang chủ
        </Link>
        <ChevronRight size={12} className="text-gray-300" />
        <Link href="/orders" className="text-gray-500 hover:text-blue-600 transition-colors font-medium">Đơn hàng</Link>
        <ChevronRight size={12} className="text-gray-300" />
        <span className="text-gray-700 font-mono font-medium">{order.trackingCode}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/orders')}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-gray-900 font-mono">{order.trackingCode}</h1>
              <button onClick={copyTracking}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Sao chép mã vận đơn">
                <Copy size={14} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Tạo lúc {order.createdAt} · {order.serviceType}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusCfg.color}`}>
          <StatusIcon size={13} />
          {statusCfg.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left col */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
              <Truck size={16} className="text-blue-600" />
              <h2 className="text-sm font-semibold text-gray-800">Hành trình đơn hàng</h2>
              <span className="ml-auto text-xs text-gray-400">Cập nhật: {order.updatedAt}</span>
            </div>
            <div className="p-5">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[15px] top-5 bottom-5 w-px bg-gray-100" />

                <div className="flex flex-col gap-0">
                  {order.timeline.map((event, idx) => (
                    <div key={idx} className={`relative flex gap-4 pb-5 last:pb-0 ${!event.done ? 'opacity-35' : ''}`}>
                      {/* Dot */}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        event.active
                          ? 'bg-blue-600 shadow-sm shadow-blue-200'
                          : event.done
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      }`}>
                        {event.active
                          ? <Truck size={14} className="text-white" />
                          : event.done
                          ? <CheckCircle size={14} className="text-green-600" />
                          : <Clock size={14} className="text-gray-400" />
                        }
                      </div>
                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <p className={`text-sm font-semibold ${event.active ? 'text-blue-700' : event.done ? 'text-gray-800' : 'text-gray-400'}`}>
                          {event.label}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-400">{event.time}</span>
                          {event.location && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin size={10} /> {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin người nhận */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
              <User size={16} className="text-blue-600" />
              <h2 className="text-sm font-semibold text-gray-800">Thông tin giao hàng</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Người nhận</p>
                <InfoRow label="Họ tên"><span className="flex items-center gap-1.5"><User size={13} className="text-gray-400" />{order.receiver.name}</span></InfoRow>
                <InfoRow label="Điện thoại"><span className="flex items-center gap-1.5"><Phone size={13} className="text-gray-400" />{order.receiver.phone}</span></InfoRow>
                <InfoRow label="Địa chỉ"><span className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" />{order.receiver.address}, {order.receiver.province}</span></InfoRow>
              </div>
              <div className="mt-5 sm:mt-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Người gửi</p>
                <InfoRow label="Tên"><span className="flex items-center gap-1.5"><User size={13} className="text-gray-400" />{order.sender.name}</span></InfoRow>
                <InfoRow label="Điện thoại"><span className="flex items-center gap-1.5"><Phone size={13} className="text-gray-400" />{order.sender.phone}</span></InfoRow>
                <InfoRow label="Địa chỉ"><span className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" />{order.sender.address}</span></InfoRow>
              </div>
            </div>
          </div>

          {/* Hàng hoá */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
              <Package size={16} className="text-blue-600" />
              <h2 className="text-sm font-semibold text-gray-800">Thông tin hàng hoá</h2>
            </div>
            <div className="p-5">
              <InfoRow label="Mô tả">{order.package.description || '—'}</InfoRow>
              <InfoRow label="Khối lượng">{order.package.weight} kg</InfoRow>
              <InfoRow label="Giá trị hàng">{order.package.value > 0 ? order.package.value.toLocaleString('vi-VN') + ' đ' : '—'}</InfoRow>
              {order.note && <InfoRow label="Ghi chú">{order.note}</InfoRow>}
            </div>
          </div>
        </div>

        {/* Right col - payment summary */}
        <div className="flex flex-col gap-5">

          {/* Thanh toán */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
              <Banknote size={16} className="text-blue-600" />
              <h2 className="text-sm font-semibold text-gray-800">Thanh toán</h2>
            </div>
            <div className="p-5 flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-gray-900">{order.shippingFee.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>COD thu hộ</span>
                <span className={`font-medium ${order.codAmount > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {order.codAmount > 0 ? order.codAmount.toLocaleString('vi-VN') + ' đ' : '—'}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Người trả phí</span>
                <span className="font-medium text-gray-900">{order.paymentSide === 'receiver' ? 'Người nhận' : 'Người gửi'}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3 mt-1 flex justify-between">
                <span className="text-xs text-gray-500">Tổng thu khi giao</span>
                <span className="font-bold text-lg text-blue-600">{totalCollect.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

          {/* Thao tác */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-800">Thao tác</h2>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <Link
                href={`/tracking/${order.trackingCode}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <ExternalLink size={14} /> Trang tracking công khai
              </Link>
              {(order.status === 'pending' || order.status === 'confirmed') && (
                <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-red-200 rounded-lg text-sm text-red-600 font-medium hover:bg-red-50 transition-colors">
                  <XCircle size={14} /> Huỷ đơn hàng
                </button>
              )}
            </div>
          </div>

          {/* Giao hàng dự kiến */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <p className="text-xs text-blue-500 font-medium">Dự kiến giao hàng</p>
            <p className="text-lg font-bold text-blue-700 mt-1">{order.estimatedDelivery}</p>
          </div>
        </div>
      </div>
    </div>
  )
}