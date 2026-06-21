'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Wallet, Plus, ArrowDownLeft, ArrowUpRight,
  CreditCard, Clock, ChevronRight, Loader2, Bell
} from 'lucide-react'
import { getMyWallet, getUserNotifications } from '@picbox/utils'
import type { WalletInfo, NotificationItem } from '@picbox/utils'
import { getCurrentUser } from '@/lib/auth-service'

function formatMoney(amount: number) {
  return amount.toLocaleString('vi-VN') + ' đ'
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const NOTIF_ICON: Record<string, { label: string; color: string }> = {
  ORDER_CREATED:        { label: 'Đơn mới',     color: 'text-blue-600 bg-blue-50' },
  ORDER_STATUS_CHANGED: { label: 'Cập nhật',    color: 'text-indigo-600 bg-indigo-50' },
  ORDER_CANCELLED:      { label: 'Huỷ đơn',     color: 'text-red-500 bg-red-50' },
  PAYMENT_SUCCESS:      { label: 'Thanh toán',  color: 'text-green-600 bg-green-50' },
  GENERIC:              { label: 'Thông báo',   color: 'text-gray-600 bg-gray-50' },
}

export default function WalletPage() {
  const [wallet, setWallet]       = useState<WalletInfo | null>(null)
  const [notifs, setNotifs]       = useState<NotificationItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState<'wallet' | 'notif'>('wallet')

  useEffect(() => {
    const user = getCurrentUser()
    Promise.all([
      getMyWallet(),
      user?.id ? getUserNotifications(user.id) : Promise.resolve([]),
    ]).then(([w, n]) => {
      setWallet(w)
      setNotifs(n)
    }).finally(() => setLoading(false))
  }, [])

  const balance = wallet?.balance ?? 0

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ví của tôi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý số dư và thông báo</p>
        </div>
        <Link href="/wallet/topup"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Nạp tiền
        </Link>
      </div>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Wallet size={18} className="opacity-80" />
          <span className="text-sm opacity-80">Số dư hiện tại</span>
        </div>
        {loading ? (
          <div className="h-10 w-40 bg-white/20 rounded-lg animate-pulse mb-1" />
        ) : (
          <p className="text-4xl font-bold mb-1">{formatMoney(balance)}</p>
        )}
        {!loading && !wallet && (
          <p className="text-xs opacity-60 mt-1">Chưa có ví — nạp tiền lần đầu để kích hoạt</p>
        )}
        <div className="flex gap-3 mt-5">
          <Link href="/wallet/topup"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
            <ArrowDownLeft size={15} /> Nạp tiền
          </Link>
          <button type="button" className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed" disabled>
            <ArrowUpRight size={15} /> Rút tiền
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Số dư ví',    value: loading ? '...' : formatMoney(balance), icon: Wallet,      color: 'text-blue-600 bg-blue-50' },
          { label: 'COD chờ về',  value: '—',                                     icon: Clock,       color: 'text-orange-500 bg-orange-50' },
          { label: 'Giao dịch',   value: '—',                                     icon: CreditCard,  color: 'text-indigo-600 bg-indigo-50' },
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

      {/* Tabs: Giao dịch / Thông báo */}
      <div>
        <div className="flex gap-1 mb-4">
          {([['wallet', 'Lịch sử ví'], ['notif', 'Thông báo']] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                tab === key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {label}
              {key === 'notif' && notifs.length > 0 && (
                <span className="ml-1.5 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                  {notifs.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === 'wallet' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Lịch sử giao dịch</h2>
              <Link href="/wallet/history"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                Xem tất cả <ChevronRight size={13} />
              </Link>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Đang tải...</span>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-400">
                <CreditCard size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Chưa có giao dịch nào</p>
                <p className="text-xs mt-1">Nạp tiền để bắt đầu sử dụng ví</p>
              </div>
            )}
          </div>
        )}

        {tab === 'notif' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Thông báo của tôi</h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Đang tải...</span>
              </div>
            ) : notifs.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                <Bell size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Chưa có thông báo nào</p>
                <p className="text-xs mt-1">Thông báo sẽ xuất hiện khi bạn tạo đơn hoặc được cập nhật</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifs.map(n => {
                  const cfg = NOTIF_ICON[n.type] ?? NOTIF_ICON.GENERIC
                  return (
                    <div key={n.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.color}`}>
                        <Bell size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-gray-900 truncate">{n.subject}</p>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md flex-shrink-0 ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{n.body}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}
