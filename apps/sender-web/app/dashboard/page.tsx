'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Package, PackageCheck, PackageX,
  TrendingUp, Clock, Truck, Loader2, AlertCircle, Eye
} from 'lucide-react'
import { getMyOrders } from '@picbox/utils'
import type { Order } from '@picbox/types'

const STATUS_LABEL: Record<string, string> = {
  pending:          'Chờ xác nhận',
  confirmed:        'Đã xác nhận',
  picked_up:        'Đã lấy hàng',
  in_transit:       'Đang vận chuyển',
  at_hub:           'Tại bưu cục',
  sorting:          'Đang phân loại',
  out_for_delivery: 'Đang giao',
  delivered:        'Đã giao',
  failed:           'Giao thất bại',
  returned:         'Hoàn hàng',
  cancelled:        'Đã hủy',
}

const STATUS_COLOR: Record<string, string> = {
  pending:          'bg-gray-100 text-gray-500',
  confirmed:        'bg-blue-100 text-blue-700',
  picked_up:        'bg-indigo-100 text-indigo-700',
  in_transit:       'bg-purple-100 text-purple-700',
  at_hub:           'bg-purple-100 text-purple-700',
  sorting:          'bg-yellow-100 text-yellow-700',
  out_for_delivery: 'bg-yellow-100 text-yellow-700',
  delivered:        'bg-green-100 text-green-700',
  failed:           'bg-red-100 text-red-700',
  returned:         'bg-red-100 text-red-600',
  cancelled:        'bg-gray-100 text-gray-400',
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} giờ trước`
  return `${Math.floor(hrs / 24)} ngày trước`
}

function isThisMonth(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyOrders(0, 200)
      .then(res => setOrders(res.orders))
      .catch(err => setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <Loader2 size={24} className="animate-spin mr-2" />
        <span className="text-sm">Đang tải dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-2 text-red-500">
        <AlertCircle size={32} />
        <p className="text-sm font-medium">{error}</p>
      </div>
    )
  }

  const thisMonth = orders.filter(o => isThisMonth(o.createdAt))
  const inTransit = orders.filter(o =>
    ['confirmed', 'picked_up', 'in_transit', 'at_hub', 'sorting', 'out_for_delivery'].includes(o.status as string)
  )
  const delivered  = orders.filter(o => (o.status as string) === 'delivered')
  const returned   = orders.filter(o => ['returned', 'failed'].includes(o.status as string))

  const total = orders.length || 1
  const deliveredPct  = Math.round((delivered.length / total) * 100)
  const inTransitPct  = Math.round((inTransit.length / total) * 100)
  const returnedPct   = Math.round((returned.length / total) * 100)

  const now = new Date()
  const monthLabel = `tháng ${now.getMonth() + 1}/${now.getFullYear()}`

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const stats = [
    { label: `Tổng đơn ${monthLabel}`, value: thisMonth.length, icon: Package,      color: 'bg-blue-50 text-blue-600' },
    { label: 'Đang giao',              value: inTransit.length,  icon: Truck,        color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Đã giao thành công',     value: delivered.length,  icon: PackageCheck, color: 'bg-green-50 text-green-600' },
    { label: 'Hoàn / Thất bại',        value: returned.length,   icon: PackageX,     color: 'bg-red-50 text-red-600' },
  ]

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan hoạt động {monthLabel}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Ratio */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Phân bố trạng thái đơn hàng</h2>
            <span className="text-xs text-gray-400">Tổng: {orders.length} đơn</span>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Đã giao',       count: delivered.length,  pct: deliveredPct,  color: 'bg-green-500' },
              { label: 'Đang giao',     count: inTransit.length,  pct: inTransitPct,  color: 'bg-yellow-400' },
              { label: 'Hoàn / Thất bại', count: returned.length, pct: returnedPct,   color: 'bg-red-400' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">{item.label}</span>
                  <span className="text-xs font-medium text-gray-900">{item.count} đơn ({item.pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-900">Tóm tắt</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} className="text-gray-400" />
              <span>Đơn tháng này: <strong className="text-gray-900">{thisMonth.length}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp size={14} className="text-gray-400" />
              <span>Tỷ lệ giao thành công: <strong className="text-gray-900">{deliveredPct}%</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package size={14} className="text-gray-400" />
              <span>Tổng tất cả đơn: <strong className="text-gray-900">{orders.length}</strong></span>
            </div>
          </div>
          <Link href="/orders" className="mt-auto text-xs text-blue-600 hover:underline font-medium">
            Xem tất cả đơn hàng →
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Đơn hàng gần đây</h2>
          <Link href="/orders" className="text-xs text-blue-600 hover:underline">Xem tất cả →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Package size={32} className="mb-2 opacity-40" />
            <p className="text-sm">Chưa có đơn hàng nào</p>
            <Link href="/orders/new" className="mt-2 text-xs text-blue-600 hover:underline">Tạo đơn đầu tiên</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package size={15} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono font-medium text-blue-600">{order.trackingCode}</p>
                  <p className="text-xs text-gray-500 truncate">{order.receiverName} · {order.receiverPhone}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLOR[order.status as string] ?? 'bg-gray-100 text-gray-500'}`}>
                  {STATUS_LABEL[order.status as string] ?? order.status}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                  {formatRelativeTime(order.createdAt)}
                </span>
                <Link href={`/orders/${order.id}`} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 flex-shrink-0">
                  <Eye size={13} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
