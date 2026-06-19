'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Home, ChevronRight, ArrowLeft, Package,
  MapPin, Phone, User, Banknote, Clock,
  CheckCircle, Truck, RotateCcw, XCircle,
  Copy, ExternalLink, AlertCircle, Loader2
} from 'lucide-react'
import { ToastContainer, useToast } from '@/components/ui/toast'
import { getOrder, getOrderHistory, cancelOrder } from '@picbox/utils'
import type { OrderHistoryEvent } from '@picbox/utils'
import type { Order } from '@picbox/types'

// ---- Status config ----
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:          { label: 'Chờ xác nhận',   color: 'bg-amber-100 text-amber-700',   icon: Clock },
  confirmed:        { label: 'Đã xác nhận',     color: 'bg-blue-100 text-blue-700',     icon: CheckCircle },
  picked_up:        { label: 'Đã lấy hàng',     color: 'bg-indigo-100 text-indigo-700', icon: Package },
  in_transit:       { label: 'Đang vận chuyển', color: 'bg-purple-100 text-purple-700', icon: Truck },
  at_hub:           { label: 'Tại bưu cục',     color: 'bg-purple-100 text-purple-700', icon: Package },
  sorting:          { label: 'Đang phân loại',  color: 'bg-yellow-100 text-yellow-700', icon: Package },
  out_for_delivery: { label: 'Đang giao',       color: 'bg-blue-100 text-blue-700',     icon: Truck },
  delivered:        { label: 'Đã giao',         color: 'bg-green-100 text-green-700',   icon: CheckCircle },
  failed:           { label: 'Giao thất bại',   color: 'bg-red-100 text-red-700',       icon: XCircle },
  returned:         { label: 'Hoàn hàng',       color: 'bg-rose-100 text-rose-700',     icon: RotateCcw },
  cancelled:        { label: 'Đã huỷ',          color: 'bg-gray-100 text-gray-500',     icon: XCircle },
}

const TIMELINE_DOT: Record<string, { dot: string; icon: React.ElementType; iconColor: string; textColor: string }> = {
  confirmed:        { dot: 'bg-blue-100 ring-2 ring-blue-200',         icon: CheckCircle, iconColor: 'text-blue-600',   textColor: 'text-blue-700'   },
  picked_up:        { dot: 'bg-indigo-500 shadow-md shadow-indigo-200',icon: Package,     iconColor: 'text-white',      textColor: 'text-indigo-700' },
  at_hub:           { dot: 'bg-purple-500 shadow-md shadow-purple-200',icon: Package,     iconColor: 'text-white',      textColor: 'text-purple-700' },
  sorting:          { dot: 'bg-yellow-400 shadow-md shadow-yellow-200',icon: Package,     iconColor: 'text-white',      textColor: 'text-yellow-700' },
  in_transit:       { dot: 'bg-purple-500 shadow-md shadow-purple-200',icon: Truck,       iconColor: 'text-white',      textColor: 'text-purple-700' },
  out_for_delivery: { dot: 'bg-blue-500 shadow-md shadow-blue-200',    icon: Truck,       iconColor: 'text-white',      textColor: 'text-blue-700'   },
  delivered:        { dot: 'bg-green-500 shadow-md shadow-green-200',  icon: CheckCircle, iconColor: 'text-white',      textColor: 'text-green-700'  },
  failed:           { dot: 'bg-red-500 shadow-md shadow-red-200',      icon: XCircle,     iconColor: 'text-white',      textColor: 'text-red-700'    },
  returned:         { dot: 'bg-rose-400 shadow-md shadow-rose-200',    icon: RotateCcw,   iconColor: 'text-white',      textColor: 'text-rose-700'   },
  cancelled:        { dot: 'bg-gray-400',                              icon: XCircle,     iconColor: 'text-white',      textColor: 'text-gray-500'   },
  default:          { dot: 'bg-blue-100 ring-2 ring-blue-200',         icon: CheckCircle, iconColor: 'text-blue-500',   textColor: 'text-gray-700'   },
}
const PENDING_DOT = { dot: 'bg-white border-2 border-gray-200', icon: Clock, iconColor: 'text-gray-300', textColor: 'text-gray-400' }

function formatDateTime(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
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
  const { success, error: showError } = useToast()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [history, setHistory] = useState<OrderHistoryEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    Promise.all([getOrder(orderId), getOrderHistory(orderId)])
      .then(([o, h]) => { setOrder(o); setHistory(h) })
      .catch(err => setLoadError(err instanceof Error ? err.message : 'Không thể tải đơn hàng'))
      .finally(() => setLoading(false))
  }, [orderId])

  const copyTracking = () => {
    if (!order) return
    navigator.clipboard.writeText(order.trackingCode)
    success('Đã sao chép!', `Mã vận đơn ${order.trackingCode} đã được sao chép`)
  }

  const handleCancelOrder = async () => {
    if (!order) return
    setCancelling(true)
    try {
      await cancelOrder(order.id)
      setOrder(prev => prev ? { ...prev, status: 'cancelled' } : prev)
      success('Đã huỷ đơn', `Đơn hàng ${order.trackingCode} đã được huỷ`)
    } catch (err) {
      showError('Huỷ thất bại', err instanceof Error ? err.message : 'Không thể huỷ đơn')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <>
        <ToastContainer />
        <div className="flex items-center justify-center py-32 text-gray-400">
          <Loader2 size={24} className="animate-spin mr-2" />
          <span className="text-sm">Đang tải thông tin đơn hàng...</span>
        </div>
      </>
    )
  }

  if (loadError || !order) {
    return (
      <>
        <ToastContainer />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
          <AlertCircle size={40} className="text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-700">Không tìm thấy đơn hàng</h2>
          <p className="text-sm text-gray-400">{loadError || 'Mã đơn không tồn tại hoặc đã bị xoá'}</p>
          <Link href="/orders"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Về danh sách đơn
          </Link>
        </div>
      </>
    )
  }

  const statusCfg = STATUS_CONFIG[order.status as string] ?? STATUS_CONFIG['pending']
  const StatusIcon = statusCfg.icon
  const totalCollect = order.codAmount

  // Build timeline from history; if empty, show single current-status entry
  const timelineItems = history.length > 0
    ? history.map((h, idx) => ({
        status:   h.status as string,
        label:    STATUS_CONFIG[h.status as string]?.label ?? String(h.status),
        time:     formatDateTime(h.timestamp),
        location: h.note || '',
        done:     true,
        active:   idx === history.length - 1,
      }))
    : [{
        status:   order.status as string,
        label:    statusCfg.label,
        time:     formatDateTime(order.updatedAt),
        location: '',
        done:     true,
        active:   true,
      }]

  return (
    <>
      <ToastContainer />

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
            <button type="button" onClick={() => router.push('/orders')}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Quay lại">
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-gray-900 font-mono">{order.trackingCode}</h1>
                <button type="button" onClick={copyTracking}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Sao chép mã vận đơn">
                  <Copy size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Tạo lúc {formatDateTime(order.createdAt)}
              </p>
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
                <span className="ml-auto text-xs text-gray-400">Cập nhật: {formatDateTime(order.updatedAt)}</span>
              </div>
              <div className="p-5">
                <div className="relative">
                  <div className="absolute left-[15px] top-5 bottom-5 w-px bg-gray-100" />
                  <div className="flex flex-col gap-0">
                    {timelineItems.map((event, idx) => {
                      const dotCfg = event.done
                        ? (TIMELINE_DOT[event.status] ?? TIMELINE_DOT['default'])
                        : PENDING_DOT
                      const DotIcon = dotCfg.icon
                      return (
                        <div key={idx} className="relative flex gap-4 pb-5 last:pb-0">
                          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${dotCfg.dot}`}>
                            <DotIcon size={14} className={dotCfg.iconColor} />
                          </div>
                          <div className="flex-1 pt-1">
                            <p className={`text-sm font-semibold ${event.active ? dotCfg.textColor : event.done ? 'text-gray-800' : 'text-gray-400'}`}>
                              {event.label}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              {event.time && event.time !== '—' && (
                                <span className="text-xs text-gray-400">{event.time}</span>
                              )}
                              {event.location && (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <MapPin size={10} /> {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin người nhận / gửi */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
                <User size={16} className="text-blue-600" />
                <h2 className="text-sm font-semibold text-gray-800">Thông tin giao hàng</h2>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Người nhận</p>
                  <InfoRow label="Họ tên">
                    <span className="flex items-center gap-1.5"><User size={13} className="text-gray-400" />{order.receiverName}</span>
                  </InfoRow>
                  <InfoRow label="Điện thoại">
                    <span className="flex items-center gap-1.5"><Phone size={13} className="text-gray-400" />{order.receiverPhone}</span>
                  </InfoRow>
                  <InfoRow label="Địa chỉ">
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" />{order.receiverAddress}</span>
                  </InfoRow>
                </div>
                <div className="mt-5 sm:mt-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Người gửi</p>
                  <InfoRow label="Tên">
                    <span className="flex items-center gap-1.5"><User size={13} className="text-gray-400" />{order.senderName}</span>
                  </InfoRow>
                  <InfoRow label="Điện thoại">
                    <span className="flex items-center gap-1.5"><Phone size={13} className="text-gray-400" />{order.senderPhone}</span>
                  </InfoRow>
                  <InfoRow label="Bưu cục gửi">
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" />{order.senderAddress}</span>
                  </InfoRow>
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
                {order.dimensions && <InfoRow label="Kích thước">{order.dimensions}</InfoRow>}
                <InfoRow label="Khối lượng">{order.weight} kg</InfoRow>
                {order.note && <InfoRow label="Ghi chú">{order.note}</InfoRow>}
              </div>
            </div>
          </div>

          {/* Right col */}
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
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="flex items-center justify-center gap-2 w-full py-2.5 border border-red-200 rounded-lg text-sm text-red-600 font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {cancelling
                      ? <><Loader2 size={14} className="animate-spin" /> Đang huỷ...</>
                      : <><XCircle size={14} /> Huỷ đơn hàng</>
                    }
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
