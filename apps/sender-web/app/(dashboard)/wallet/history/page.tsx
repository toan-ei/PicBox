'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ArrowDownLeft, ArrowUpRight,
  Search, Filter, X, ChevronLeft, ChevronRight
} from 'lucide-react'

type TxType = 'all' | 'credit' | 'debit'

const ALL_TXN = [
  { id: 'TXN001', type: 'credit', desc: 'COD đơn #PB001234', amount: 250000, date: '2026-05-15T10:30:00Z', method: 'COD' },
  { id: 'TXN002', type: 'debit',  desc: 'Phí vận chuyển #PB001235', amount: 30000, date: '2026-05-15T09:00:00Z', method: 'Ví' },
  { id: 'TXN003', type: 'credit', desc: 'Nạp tiền qua MoMo', amount: 500000, date: '2026-05-14T16:00:00Z', method: 'MoMo' },
  { id: 'TXN004', type: 'debit',  desc: 'Phí vận chuyển #PB001236', amount: 35000, date: '2026-05-14T14:00:00Z', method: 'Ví' },
  { id: 'TXN005', type: 'credit', desc: 'COD đơn #PB001237', amount: 150000, date: '2026-05-14T12:00:00Z', method: 'COD' },
  { id: 'TXN006', type: 'debit',  desc: 'Phí vận chuyển #PB001238', amount: 22000, date: '2026-05-13T11:00:00Z', method: 'Ví' },
  { id: 'TXN007', type: 'credit', desc: 'Nạp tiền qua VNPay', amount: 1000000, date: '2026-05-13T09:00:00Z', method: 'VNPay' },
  { id: 'TXN008', type: 'credit', desc: 'COD đơn #PB001240', amount: 320000, date: '2026-05-12T15:00:00Z', method: 'COD' },
  { id: 'TXN009', type: 'debit',  desc: 'Phí vận chuyển #PB001241', amount: 28000, date: '2026-05-12T10:00:00Z', method: 'Ví' },
  { id: 'TXN010', type: 'credit', desc: 'Nạp tiền chuyển khoản', amount: 2000000, date: '2026-05-11T08:00:00Z', method: 'Bank' },
  { id: 'TXN011', type: 'debit',  desc: 'Phí vận chuyển #PB001242', amount: 40000, date: '2026-05-11T07:30:00Z', method: 'Ví' },
  { id: 'TXN012', type: 'credit', desc: 'COD đơn #PB001243', amount: 180000, date: '2026-05-10T14:00:00Z', method: 'COD' },
]

const PAGE_SIZE = 8

function formatMoney(n: number) {
  return n.toLocaleString('vi-VN') + ' đ'
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export default function WalletHistoryPage() {
  const [typeFilter, setTypeFilter] = useState<TxType>('all')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [page, setPage] = useState(1)

  const filtered = ALL_TXN.filter(t => {
    const matchType = typeFilter === 'all' || t.type === typeFilter
    const matchSearch = t.desc.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
    const matchFrom = !dateFrom || new Date(t.date) >= new Date(dateFrom)
    const matchTo = !dateTo || new Date(t.date) <= new Date(dateTo + 'T23:59:59Z')
    return matchType && matchSearch && matchFrom && matchTo
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalCredit = filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const totalDebit  = filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)

  const hasFilter = typeFilter !== 'all' || dateFrom || dateTo

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/wallet"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Lịch sử giao dịch</h1>
          <p className="text-sm text-gray-500">{filtered.length} giao dịch</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
            <ArrowDownLeft size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-green-600 font-medium">Tổng thu</p>
            <p className="text-base font-bold text-green-700">+{formatMoney(totalCredit)}</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
            <ArrowUpRight size={16} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-red-500 font-medium">Tổng chi</p>
            <p className="text-base font-bold text-red-600">-{formatMoney(totalDebit)}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo mô tả, mã giao dịch..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              hasFilter ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <Filter size={15} /> Lọc
          </button>
        </div>

        {/* Type tabs */}
        <div className="flex gap-2">
          {([['all','Tất cả'],['credit','Thu tiền'],['debit','Chi tiền']] as [TxType,string][]).map(([val, label]) => (
            <button key={val}
              onClick={() => { setTypeFilter(val); setPage(1) }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                typeFilter === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Khoảng thời gian</span>
              {hasFilter && (
                <button onClick={() => { setTypeFilter('all'); setDateFrom(''); setDateTo(''); setPage(1) }}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                  <X size={12} /> Xoá lọc
                </button>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <input type="date" value={dateFrom}
                onChange={e => { setDateFrom(e.target.value); setPage(1) }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="text-gray-400 text-sm">—</span>
              <input type="date" value={dateTo}
                onChange={e => { setDateTo(e.target.value); setPage(1) }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        )}
      </div>

      {/* Transaction list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm font-medium">Không có giao dịch nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {paginated.map(txn => (
              <div key={txn.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  txn.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  {txn.type === 'credit' ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{txn.desc}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{formatDate(txn.date)}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{txn.method}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                    {txn.type === 'credit' ? '+' : '-'}{formatMoney(txn.amount)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{txn.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} / {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40">
                <ChevronLeft size={14} />
              </button>
              {Array.from({length: totalPages},(_,i)=>i+1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium ${
                    p===page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}