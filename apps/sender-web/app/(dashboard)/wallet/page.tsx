'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Wallet, Plus, ArrowDownLeft, ArrowUpRight,
  CreditCard, Clock, ChevronRight, Copy, CheckCheck
} from 'lucide-react'

const transactions = [
  { id: 'TXN001', type: 'credit', desc: 'COD đơn #PB001234', amount: 250000, date: '2026-05-15T10:30:00Z', status: 'done' },
  { id: 'TXN002', type: 'debit',  desc: 'Phí vận chuyển đơn #PB001235', amount: 30000, date: '2026-05-15T09:00:00Z', status: 'done' },
  { id: 'TXN003', type: 'credit', desc: 'Nạp tiền qua MoMo', amount: 500000, date: '2026-05-14T16:00:00Z', status: 'done' },
  { id: 'TXN004', type: 'debit',  desc: 'Phí vận chuyển đơn #PB001236', amount: 35000, date: '2026-05-14T14:00:00Z', status: 'done' },
  { id: 'TXN005', type: 'credit', desc: 'COD đơn #PB001237', amount: 150000, date: '2026-05-14T12:00:00Z', status: 'done' },
  { id: 'TXN006', type: 'debit',  desc: 'Phí vận chuyển đơn #PB001238', amount: 22000, date: '2026-05-13T11:00:00Z', status: 'done' },
  { id: 'TXN007', type: 'credit', desc: 'Nạp tiền qua VNPay', amount: 1000000, date: '2026-05-13T09:00:00Z', status: 'done' },
]

function formatMoney(amount: number) {
  return amount.toLocaleString('vi-VN') + ' đ'
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export default function WalletPage() {
  const [copied, setCopied] = useState(false)
  const accountNumber = 'SN-2026-00892'

  const balance = 2_430_000
  const pendingCOD = 780_000

  const copyAccount = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ví của tôi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý số dư và giao dịch</p>
        </div>
        <Link href="/wallet/topup"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Nạp tiền
        </Link>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Main balance */}
        <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={18} className="opacity-80" />
            <span className="text-sm opacity-80">Số dư hiện tại</span>
          </div>
          <p className="text-4xl font-bold mb-1">{formatMoney(balance)}</p>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs opacity-70">Mã tài khoản:</span>
            <span className="text-sm font-mono font-medium">{accountNumber}</span>
            <button onClick={copyAccount}
              className="ml-1 opacity-70 hover:opacity-100 transition-opacity">
              {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="flex gap-3 mt-5">
            <Link href="/wallet/topup"
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
              <ArrowDownLeft size={15} /> Nạp tiền
            </Link>
            <button className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
              <ArrowUpRight size={15} /> Rút tiền
            </button>
          </div>
        </div>

        {/* COD pending */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-600 mb-3">
              <Clock size={16} />
              <span className="text-sm font-medium">COD chờ thanh toán</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatMoney(pendingCOD)}</p>
            <p className="text-xs text-gray-500 mt-1">Từ 4 đơn hàng đã giao</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Dự kiến về ví trong <strong className="text-gray-700">1–2 ngày</strong></p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Thu tháng này', value: formatMoney(1_900_000), icon: ArrowDownLeft, color: 'text-green-600 bg-green-50' },
          { label: 'Chi tháng này', value: formatMoney(87_000), icon: ArrowUpRight, color: 'text-red-500 bg-red-50' },
          { label: 'Giao dịch', value: '24 lần', icon: CreditCard, color: 'text-blue-600 bg-blue-50' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Transactions */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Lịch sử giao dịch gần đây</h2>
          <Link href="/wallet/history"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
            Xem tất cả <ChevronRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {transactions.slice(0, 5).map(txn => (
            <div key={txn.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                txn.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
              }`}>
                {txn.type === 'credit'
                  ? <ArrowDownLeft size={16} />
                  : <ArrowUpRight size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{txn.desc}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(txn.date)}</p>
              </div>
              <span className={`text-sm font-semibold flex-shrink-0 ${
                txn.type === 'credit' ? 'text-green-600' : 'text-red-500'
              }`}>
                {txn.type === 'credit' ? '+' : '-'}{formatMoney(txn.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}