'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Copy, CheckCheck, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { savePendingTopUp } from '@picbox/utils'
import { getCurrentUser } from '@/lib/auth-service'

const PRESET_AMOUNTS = [100_000, 200_000, 500_000, 1_000_000, 2_000_000, 5_000_000]

const BANK_INFO = {
  bank: 'Vietcombank',
  account: '1234567890',
  name: 'CONG TY PICBOX',
  branch: 'Chi nhánh TP. Hồ Chí Minh',
}

function formatMoney(n: number) {
  return n.toLocaleString('vi-VN') + ' đ'
}

export default function TopupPage() {
  const [amount, setAmount] = useState<number>(500_000)
  const [customAmount, setCustomAmount] = useState('')
  const [step, setStep] = useState<'input' | 'confirm' | 'done'>('input')
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const finalAmount = customAmount
    ? parseInt(customAmount.replace(/\D/g, '')) || 0
    : amount

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    setError('')
    try {
      const user = getCurrentUser()
      if (!user?.id) throw new Error('Vui lòng đăng nhập lại')
      savePendingTopUp({
        userId:   user.id,
        userName: user.name,
        amount:   finalAmount,
        note:     note.trim() || undefined,
      })
      setStep('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  const transferContent = `NAP ${finalAmount} PB-${Date.now().toString().slice(-8)}`

  return (
    <div className="flex flex-col gap-5 max-w-xl">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/wallet"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Nạp tiền vào ví</h1>
          <p className="text-sm text-gray-500">Chuyển khoản ngân hàng — Admin sẽ duyệt trong vòng 5–15 phút</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {['Chọn số tiền', 'Xác nhận CK', 'Chờ duyệt'].map((s, i) => {
          const stepNum = i + 1
          const cur = step === 'input' ? 1 : step === 'confirm' ? 2 : 3
          const done = cur > stepNum
          const active = cur === stepNum
          return (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {done ? '✓' : stepNum}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${active ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < 2 && <div className={`w-8 h-px ${done ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          )
        })}
      </div>

      {/* STEP 1 — Chọn số tiền */}
      {step === 'input' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Chọn số tiền</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {PRESET_AMOUNTS.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => { setAmount(a); setCustomAmount('') }}
                  className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                    amount === a && !customAmount
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {formatMoney(a)}
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Hoặc nhập số tiền khác</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập số tiền..."
                  value={customAmount}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '')
                    setCustomAmount(raw ? parseInt(raw).toLocaleString('vi-VN') : '')
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">đ</span>
              </div>
              {finalAmount > 0 && finalAmount < 10_000 && (
                <p className="text-red-500 text-xs mt-1">Số tiền tối thiểu là 10.000đ</p>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-gray-500 block mb-1">Ghi chú (tuỳ chọn)</label>
              <input
                type="text"
                placeholder="VD: Nạp tiền tháng 6"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Tổng nạp</p>
              <p className="text-2xl font-bold text-blue-700">{formatMoney(finalAmount)}</p>
            </div>
            <button
              type="button"
              disabled={finalAmount < 10_000}
              onClick={() => setStep('confirm')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tiếp tục →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — Thông tin chuyển khoản */}
      {step === 'confirm' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">Chuyển khoản theo thông tin sau</p>
            <div className="flex flex-col gap-0 divide-y divide-gray-100">
              {[
                { label: 'Ngân hàng',      value: BANK_INFO.bank,     copyKey: null },
                { label: 'Số tài khoản',   value: BANK_INFO.account,  copyKey: 'account' },
                { label: 'Tên tài khoản',  value: BANK_INFO.name,     copyKey: 'name' },
                { label: 'Chi nhánh',      value: BANK_INFO.branch,   copyKey: null },
                { label: 'Số tiền',        value: formatMoney(finalAmount), copyKey: null },
                { label: 'Nội dung CK',    value: transferContent,    copyKey: 'content' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-3">
                  <span className="text-xs text-gray-500 w-32 flex-shrink-0">{row.label}</span>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className={`text-sm font-medium text-gray-900 text-right ${row.label === 'Nội dung CK' ? 'font-mono text-blue-700' : ''}`}>
                      {row.value}
                    </span>
                    {row.copyKey && (
                      <button
                        type="button"
                        onClick={() => copy(row.value, row.copyKey!)}
                        className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                      >
                        {copied === row.copyKey ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
              <p className="text-xs text-amber-700">
                ⚠️ Nhập <strong>đúng nội dung chuyển khoản</strong> để Admin xác nhận giao dịch của bạn nhanh hơn.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle size={14} className="shrink-0" /> {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('input')}
              className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors"
            >
              Quay lại
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting
                ? <><Loader2 size={14} className="animate-spin" /> Đang gửi...</>
                : 'Tôi đã chuyển khoản'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Chờ duyệt */}
      {step === 'done' && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-amber-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Yêu cầu đang chờ duyệt</h2>
          <p className="text-sm text-gray-500 mb-2">
            Admin đã nhận được yêu cầu nạp <strong className="text-gray-800">{formatMoney(finalAmount)}</strong> của bạn.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Số dư sẽ được cộng vào ví sau khi Admin xác nhận chuyển khoản (thường trong 5–15 phút).
          </p>
          <div className="flex items-center gap-2 justify-center p-3 bg-amber-50 border border-amber-100 rounded-lg mb-6">
            <CheckCircle size={14} className="text-amber-600" />
            <span className="text-sm text-amber-700 font-medium">Trạng thái: Chờ admin duyệt</span>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/wallet"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              Về ví của tôi
            </Link>
            <button
              type="button"
              onClick={() => { setStep('input'); setCustomAmount(''); setNote('') }}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors"
            >
              Nạp thêm
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
