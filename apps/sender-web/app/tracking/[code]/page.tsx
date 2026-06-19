'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search, Package, Truck, CheckCircle,
  XCircle, RotateCcw, Clock, MapPin,
  Phone, User, ArrowLeft, Loader2, AlertCircle
} from 'lucide-react'
import { getOrderByTracking, getOrderHistory } from '@picbox/utils'
import type { OrderHistoryEvent } from '@picbox/utils'
import type { Order } from '@picbox/types'

// ── Status config ────────────────────────────────────────────────────
const STATUS_CFG: Record<string, {
  label: string; color: string; bg: string; icon: React.ElementType; desc: string
}> = {
  pending:          { label: 'Chờ xác nhận',   color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',   icon: Clock,       desc: 'Đơn hàng đang chờ xác nhận từ hệ thống' },
  confirmed:        { label: 'Đã xác nhận',     color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     icon: CheckCircle, desc: 'Đơn hàng đã được xác nhận, đang chờ lấy hàng' },
  picked_up:        { label: 'Đã lấy hàng',     color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', icon: Package,     desc: 'Shipper đã lấy hàng thành công' },
  in_transit:       { label: 'Đang vận chuyển', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Truck,       desc: 'Hàng đang trên đường vận chuyển' },
  at_hub:           { label: 'Tại bưu cục',     color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Package,     desc: 'Hàng đang ở bưu cục, chuẩn bị phát' },
  sorting:          { label: 'Đang phân loại',  color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: Package,     desc: 'Hàng đang được phân loại tại bưu cục' },
  out_for_delivery: { label: 'Đang giao',       color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     icon: Truck,       desc: 'Shipper đang trên đường giao đến bạn' },
  delivered:        { label: 'Đã giao',         color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   icon: CheckCircle, desc: 'Giao hàng thành công' },
  failed:           { label: 'Giao thất bại',   color: 'text-red-700',    bg: 'bg-red-50 border-red-200',       icon: XCircle,     desc: 'Không giao được hàng, vui lòng liên hệ shipper' },
  returned:         { label: 'Hoàn hàng',       color: 'text-rose-700',   bg: 'bg-rose-50 border-rose-200',     icon: RotateCcw,   desc: 'Hàng đang được hoàn về người gửi' },
  cancelled:        { label: 'Đã huỷ',          color: 'text-gray-600',   bg: 'bg-gray-50 border-gray-200',     icon: XCircle,     desc: 'Đơn hàng đã bị huỷ' },
}

// ── Timeline dot config ──────────────────────────────────────────────
const DOT_CFG: Record<string, { dot: string; icon: React.ElementType; iconColor: string }> = {
  confirmed:        { dot: 'bg-blue-500',   icon: CheckCircle, iconColor: 'text-white' },
  picked_up:        { dot: 'bg-indigo-500', icon: Package,     iconColor: 'text-white' },
  at_hub:           { dot: 'bg-purple-500', icon: Package,     iconColor: 'text-white' },
  sorting:          { dot: 'bg-orange-400', icon: Package,     iconColor: 'text-white' },
  in_transit:       { dot: 'bg-purple-500', icon: Truck,       iconColor: 'text-white' },
  out_for_delivery: { dot: 'bg-blue-600',   icon: Truck,       iconColor: 'text-white' },
  delivered:        { dot: 'bg-green-500',  icon: CheckCircle, iconColor: 'text-white' },
  failed:           { dot: 'bg-red-500',    icon: XCircle,     iconColor: 'text-white' },
  returned:         { dot: 'bg-rose-400',   icon: RotateCcw,   iconColor: 'text-white' },
  cancelled:        { dot: 'bg-gray-400',   icon: XCircle,     iconColor: 'text-white' },
  default:          { dot: 'bg-gray-200',   icon: Clock,       iconColor: 'text-gray-400' },
}
const PENDING_DOT = { dot: 'bg-white border-2 border-gray-200', icon: Clock, iconColor: 'text-gray-300' }

// ── Progress steps ───────────────────────────────────────────────────
const PROGRESS_STEPS = [
  { key: ['confirmed'],                    label: 'Xác nhận' },
  { key: ['picked_up'],                    label: 'Lấy hàng' },
  { key: ['at_hub', 'in_transit', 'sorting'], label: 'Vận chuyển' },
  { key: ['out_for_delivery'],             label: 'Đang giao' },
  { key: ['delivered'],                    label: 'Hoàn thành' },
]

function getProgressStep(status: string): number {
  for (let i = PROGRESS_STEPS.length - 1; i >= 0; i--) {
    if (PROGRESS_STEPS[i].key.includes(status)) return i
  }
  return 0
}

function formatDateTime(iso: string) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso
  }
}

// ── Timeline item shape ──────────────────────────────────────────────
interface TimelineItem {
  status: string
  label: string
  time: string
  location?: string
  done: boolean
  active: boolean
}

function buildTimeline(order: Order, history: OrderHistoryEvent[]): TimelineItem[] {
  if (history.length > 0) {
    return history.map((h, idx) => ({
      status:   h.status as string,
      label:    STATUS_CFG[h.status as string]?.label ?? String(h.status),
      time:     formatDateTime(h.timestamp),
      location: h.note || '',
      done:     true,
      active:   idx === history.length - 1,
    }))
  }
  return [{
    status:   order.status as string,
    label:    STATUS_CFG[order.status as string]?.label ?? String(order.status),
    time:     formatDateTime(order.updatedAt),
    location: '',
    done:     true,
    active:   true,
  }]
}

// ── Search bar ───────────────────────────────────────────────────────
function TrackingSearch({ initialCode = '' }: { initialCode?: string }) {
  const router = useRouter()
  const [code, setCode] = useState(initialCode)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (trimmed) router.push(`/tracking/${trimmed}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Nhập mã vận đơn (VD: PB001234)"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            font-mono tracking-wide"
        />
      </div>
      <button type="submit"
        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold
          hover:bg-blue-700 active:bg-blue-800 transition-colors whitespace-nowrap">
        Tra cứu
      </button>
    </form>
  )
}

// ── Result card ──────────────────────────────────────────────────────
function TrackingResult({ order, timeline }: { order: Order; timeline: TimelineItem[] }) {
  const status = order.status as string
  const cfg = STATUS_CFG[status] ?? STATUS_CFG['pending']
  const StatusIcon = cfg.icon
  const isFailed   = ['failed', 'returned', 'cancelled'].includes(status)
  const isDelivered = status === 'delivered'
  const progressStep = isFailed ? -1 : getProgressStep(status)

  return (
    <div className="flex flex-col gap-5 mt-6">

      {/* Status banner */}
      <div className={`flex items-center gap-4 p-5 rounded-2xl border ${cfg.bg}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
          isDelivered ? 'bg-green-100' : isFailed ? 'bg-red-100' : 'bg-white shadow-sm'
        }`}>
          <StatusIcon size={22} className={cfg.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-base font-bold ${cfg.color}`}>{cfg.label}</span>
            <span className="text-xs text-gray-400 font-mono">{order.trackingCode}</span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{cfg.desc}</p>
          <p className="text-xs text-gray-400 mt-1">Cập nhật: {formatDateTime(order.updatedAt)}</p>
        </div>
        {isDelivered && <div className="text-3xl shrink-0">🎉</div>}
      </div>

      {/* Progress bar */}
      {!isFailed && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-[18px] h-0.5 bg-gray-100 z-0" />
            <div
              className="absolute left-0 top-[18px] h-0.5 bg-blue-500 z-0 transition-all duration-700"
              style={{ width: `${(progressStep / (PROGRESS_STEPS.length - 1)) * 100}%` }}
            />
            {PROGRESS_STEPS.map((step, i) => {
              const done   = i <= progressStep
              const active = i === progressStep
              return (
                <div key={step.label} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    active ? 'bg-blue-600 shadow-md shadow-blue-200 scale-110'
                    : done  ? 'bg-blue-100'
                    : 'bg-gray-100'
                  }`}>
                    {done
                      ? <CheckCircle size={16} className={active ? 'text-white' : 'text-blue-500'} />
                      : <div className="w-2 h-2 rounded-full bg-gray-300" />
                    }
                  </div>
                  <span className={`text-[11px] font-medium text-center leading-tight ${
                    active ? 'text-blue-700' : done ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Trạng thái hiện tại</span>
            <span className={`text-sm font-bold ${isDelivered ? 'text-green-600' : 'text-blue-700'}`}>
              {isDelivered ? '✓ Đã giao thành công' : cfg.label}
            </span>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50">
          <Truck size={15} className="text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-800">Hành trình đơn hàng</h2>
        </div>
        <div className="p-5">
          <div className="relative">
            <div className="absolute left-[15px] top-5 bottom-5 w-px bg-gray-100" />
            <div className="flex flex-col gap-0">
              {timeline.map((event, idx) => {
                const dotCfg = event.done
                  ? (DOT_CFG[event.status] ?? DOT_CFG['default'])
                  : PENDING_DOT
                const DotIcon = dotCfg.icon
                return (
                  <div key={idx} className="relative flex gap-4 pb-5 last:pb-0">
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${dotCfg.dot} ${event.active ? 'shadow-md' : ''}`}>
                      <DotIcon size={14} className={dotCfg.iconColor} />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`text-sm font-semibold ${
                        event.active
                          ? (DOT_CFG[event.status]?.dot.replace('bg-', 'text-') ?? 'text-blue-700')
                          : event.done ? 'text-gray-800' : 'text-gray-400'
                      }`}>
                        {event.label}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
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

      {/* Receiver info — obfuscated */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50">
          <User size={15} className="text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-800">Thông tin giao hàng</h2>
        </div>
        <div className="p-5 flex flex-col gap-3 text-sm">
          <div className="flex items-start gap-3">
            <User size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Người nhận</p>
              <p className="font-medium text-gray-900">
                {order.receiverName.charAt(0)}{'*'.repeat(Math.max(order.receiverName.length - 2, 2))}{order.receiverName.slice(-1)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Số điện thoại</p>
              <p className="font-medium text-gray-900 font-mono">
                {order.receiverPhone.slice(0, 3)}****{order.receiverPhone.slice(-3)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Địa chỉ giao</p>
              <p className="font-medium text-gray-900">{order.receiverAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Not found ────────────────────────────────────────────────────────
function NotFound({ code }: { code: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <Package size={28} className="text-gray-400" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-800">Không tìm thấy đơn hàng</h3>
        <p className="text-sm text-gray-500 mt-1">
          Mã vận đơn <span className="font-mono font-semibold text-gray-700">"{code}"</span> không tồn tại
        </p>
      </div>
      <p className="text-xs text-gray-400 max-w-xs">
        Vui lòng kiểm tra lại mã vận đơn hoặc liên hệ người gửi để được hỗ trợ
      </p>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────
export default function TrackingPage() {
  const params = useParams()
  const code = (params.code as string)?.toUpperCase() ?? ''

  const [order, setOrder]     = useState<Order | null>(null)
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(!!code)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!code) return
    setLoading(true)
    setNotFound(false)
    setOrder(null)

    getOrderByTracking(code)
      .then(async o => {
        setOrder(o)
        const history = await getOrderHistory(o.id).catch(() => [] as OrderHistoryEvent[])
        setTimeline(buildTimeline(o, history))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [code])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Public header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="font-bold text-blue-600 text-lg tracking-tight shrink-0">
            ShipNow
          </Link>
          <div className="flex-1 max-w-sm">
            <TrackingSearch initialCode={code} />
          </div>
          <Link href="/auth/login"
            className="shrink-0 text-sm text-gray-500 hover:text-blue-600 transition-colors hidden sm:block">
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">

        {code && (
          <Link href="/tracking"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors mb-2">
            <ArrowLeft size={12} /> Tra cứu đơn khác
          </Link>
        )}

        <h1 className="text-xl font-bold text-gray-900 mb-1">Tra cứu đơn hàng</h1>
        <p className="text-sm text-gray-500 mb-5">
          Nhập mã vận đơn để theo dõi trạng thái giao hàng
        </p>

        {/* Search (large — shown when no code) */}
        {!code && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <TrackingSearch />
            <p className="text-xs text-gray-400 mt-3 text-center">
              Mã vận đơn có dạng: <span className="font-mono font-medium text-gray-600">PB001234</span>
            </p>
          </div>
        )}

        {/* Loading */}
        {code && loading && (
          <div className="flex items-center justify-center py-20 text-gray-400 mt-6">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span className="text-sm">Đang tra cứu...</span>
          </div>
        )}

        {/* Result / Not found */}
        {code && !loading && (
          notFound
            ? <NotFound code={code} />
            : order && <TrackingResult order={order} timeline={timeline} />
        )}

        {/* API error fallback */}
        {code && !loading && !notFound && !order && (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-center mt-6">
            <AlertCircle size={32} className="text-gray-300" />
            <p className="text-sm text-gray-500">Không thể kết nối đến hệ thống. Vui lòng thử lại.</p>
          </div>
        )}
      </div>
    </div>
  )
}
