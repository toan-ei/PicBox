'use client'

import { useState, useEffect } from 'react'
import {
  Search, Filter, Plus, Package,
  ChevronLeft, ChevronRight, Eye,
  ArrowUpDown, X, Home, Loader2, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { getMyOrders } from '@picbox/utils'
import type { Order, OrderStatus } from '@picbox/types'

// ---- Status config ----
const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  pending:          { label: 'Chờ xác nhận',   color: 'bg-gray-100 text-gray-500',     dot: 'bg-gray-400' },
  confirmed:        { label: 'Đã xác nhận',     color: 'bg-blue-50 text-blue-600',      dot: 'bg-blue-500' },
  picked_up:        { label: 'Đã lấy hàng',     color: 'bg-violet-50 text-violet-600',  dot: 'bg-violet-500' },
  in_transit:       { label: 'Đang vận chuyển', color: 'bg-violet-50 text-violet-600',  dot: 'bg-violet-500' },
  at_hub:           { label: 'Tại bưu cục',     color: 'bg-orange-50 text-orange-600',  dot: 'bg-orange-400' },
  sorting:          { label: 'Đang phân loại',  color: 'bg-orange-50 text-orange-600',  dot: 'bg-orange-400' },
  out_for_delivery: { label: 'Đang giao',       color: 'bg-cyan-50 text-cyan-600',      dot: 'bg-cyan-500' },
  delivered:        { label: 'Đã giao',         color: 'bg-green-50 text-green-600',    dot: 'bg-green-500' },
  failed:           { label: 'Giao thất bại',   color: 'bg-red-50 text-red-500',        dot: 'bg-red-400' },
  returned:         { label: 'Hoàn hàng',       color: 'bg-amber-50 text-amber-600',    dot: 'bg-amber-400' },
  cancelled:        { label: 'Đã hủy',          color: 'bg-gray-100 text-gray-400',     dot: 'bg-gray-300' },
}

const STATUS_FILTERS = [
  { value: 'all',              label: 'Tất cả' },
  { value: 'pending',          label: 'Chờ xác nhận' },
  { value: 'confirmed',        label: 'Đã xác nhận' },
  { value: 'out_for_delivery', label: 'Đang giao' },
  { value: 'delivered',        label: 'Đã giao' },
  { value: 'failed',           label: 'Thất bại' },
  { value: 'returned',         label: 'Hoàn hàng' },
  { value: 'cancelled',        label: 'Đã hủy' },
]

const PAGE_SIZE = 5

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('vi-VN') + ' đ'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')
  const [showFilter, setShowFilter] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    getMyOrders(0, 100)
      .then(res => setOrders(res.orders))
      .catch(err => setError(err instanceof Error ? err.message : 'Không thể tải đơn hàng'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { setPage(1) }, [search, statusFilter, dateFrom, dateTo])

  const filtered = orders
    .filter(o => {
      const matchSearch =
        o.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
        o.receiverName.toLowerCase().includes(search.toLowerCase()) ||
        o.receiverPhone.includes(search)
      const matchStatus = statusFilter === 'all' || (o.status as string) === statusFilter
      const matchDateFrom = !dateFrom || new Date(o.createdAt) >= new Date(dateFrom)
      const matchDateTo = !dateTo || new Date(o.createdAt) <= new Date(dateTo + 'T23:59:59Z')
      return matchSearch && matchStatus && matchDateFrom && matchDateTo
    })
    .sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return sortDir === 'desc' ? diff : -diff
    })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasActiveFilter = statusFilter !== 'all' || dateFrom || dateTo

  const resetFilters = () => {
    setStatusFilter('all')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <Loader2 size={24} className="animate-spin mr-2" />
        <span className="text-sm">Đang tải đơn hàng...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-red-500 gap-2">
        <AlertCircle size={32} />
        <p className="text-sm font-medium">{error}</p>
        <button
          type="button"
          onClick={() => { setError(''); setLoading(true); getMyOrders(0, 100).then(r => setOrders(r.orders)).catch(e => setError(e.message)).finally(() => setLoading(false)) }}
          className="text-xs text-blue-600 hover:underline"
        >
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
        >
          <Home size={12} />
          Trang chủ
        </Link>
        <ChevronRight size={12} className="text-gray-300" />
        <span className="text-gray-500 font-medium">Danh sách đơn hàng</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Danh sách đơn hàng</h1>
          <p className="text-xs text-gray-400 font-normal">
            Tổng <span className="font-semibold text-gray-600">{filtered.length}</span> đơn hàng
          </p>
        </div>
        <Link href="/orders/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm">
          <Plus size={15} />
          Tạo đơn mới
        </Link>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo mã vận đơn, tên, SĐT người nhận..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              hasActiveFilter
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter size={14} />
            Lọc
            {hasActiveFilter && (
              <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">!</span>
            )}
          </button>

          <button
            onClick={() => { setSortDir(d => d === 'desc' ? 'asc' : 'desc'); setPage(1) }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 bg-white rounded-lg text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowUpDown size={14} />
            {sortDir === 'desc' ? 'Mới nhất' : 'Cũ nhất'}
          </button>
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Bộ lọc nâng cao</span>
              {hasActiveFilter && (
                <button onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
                  <X size={12} /> Xoá bộ lọc
                </button>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Trạng thái</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => { setStatusFilter(f.value); setPage(1) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      statusFilter === f.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Khoảng thời gian</p>
              <div className="flex gap-3 items-center">
                <input type="date" value={dateFrom}
                  onChange={e => { setDateFrom(e.target.value); setPage(1) }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="text-gray-300 text-sm">→</span>
                <input type="date" value={dateTo}
                  onChange={e => { setDateTo(e.target.value); setPage(1) }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        )}

        {/* Status tabs */}
        <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
          {STATUS_FILTERS.slice(0, 6).map(f => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1) }}
              className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                statusFilter === f.value
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package size={40} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">Không tìm thấy đơn hàng nào</p>
            <p className="text-xs mt-1">Thử thay đổi từ khóa hoặc bộ lọc</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Mã vận đơn</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Người nhận</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Địa chỉ</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">COD</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">Phí ship</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Trạng thái</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden sm:table-cell">Ngày tạo</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(order => {
                  const status = STATUS_CONFIG[order.status as string] ?? { label: order.status, color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' }
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-sm font-semibold text-blue-600">{order.trackingCode}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium text-gray-900">{order.receiverName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.receiverPhone}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <p className="text-sm text-gray-600 max-w-[180px] truncate">{order.receiverAddress}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className={`text-sm font-medium ${order.codAmount > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                          {order.codAmount > 0 ? formatCurrency(order.codAmount) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-sm text-gray-700">{formatCurrency(order.shippingFee)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Link href={`/orders/${order.id}`}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                          <Eye size={13} /> Xem
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length} đơn
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Trang trước"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                aria-label="Trang sau"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
