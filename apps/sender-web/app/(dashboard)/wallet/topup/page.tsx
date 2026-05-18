'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Copy, CheckCheck } from 'lucide-react'

const PRESET_AMOUNTS = [100_000, 200_000, 500_000, 1_000_000, 2_000_000, 5_000_000]

const PAYMENT_METHODS = [
  {
    id: 'momo',
    name: 'MoMo',
    desc: 'Ví điện tử MoMo',
    color: 'bg-pink-500',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-500',
    bgSelected: 'bg-pink-50',
    logo: '📱',
  },
  {
    id: 'vnpay',
    name: 'VNPay',
    desc: 'Thanh toán qua VNPay QR',
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-500',
    bgSelected: 'bg-blue-50',
    logo: '💳',
  },
  {
    id: 'bank',
    name: 'Chuyển khoản ngân hàng',
    desc: 'Chuyển khoản thủ công',
    color: 'bg-green-600',
    textColor: 'text-green-600',
    borderColor: 'border-green-500',
    bgSelected: 'bg-green-50',
    logo: '🏦',
  },
]

const BANK_INFO = {
  bank: 'Vietcombank',
  account: '1234567890',
  name: 'CONG TY SHIPNOW',
  branch: 'Chi nhánh TP. Hồ Chí Minh',
}

function formatMoney(n: number) {
  return n.toLocaleString('vi-VN') + ' đ'
}

export default function TopupPage() {
  const [amount, setAmount] = useState<number>(500_000)
  const [customAmount, setCustomAmount] = useState('')
  const [method, setMethod] = useState('momo')
  const [step, setStep] = useState<'input' | 'confirm' | 'done'>('input')
  const [copied, setCopied] = useState<string | null>(null)

  const finalAmount = customAmount
    ? parseInt(customAmount.replace(/\D/g, '')) || 0
    : amount

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === method)!

  return (
    <div className="flex flex-col gap-5 max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/wallet"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Nạp tiền vào ví</h1>
          <p className="text-sm text-gray-500">Chọn số tiền và phương thức thanh toán</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {['Chọn số tiền', 'Xác nhận', 'Hoàn tất'].map((s, i) => {
          const stepNum = i + 1
          const cur = step === 'input' ? 1 : step === 'confirm' ? 2 : 3
          const done = cur > stepNum
          const active = cur === stepNum
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done ? 'bg-green-500 text-white' :
                  active ? 'bg-blue-600 text-white' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {done ? '✓' : stepNum}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  active ? 'text-gray-900' : 'text-gray-400'
                }`}>{s}</span>
              </div>
              {i < 2 && <div className={`w-8 h-px ${done ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          )
        })}
      </div>

      {/* STEP 1 — Chọn số tiền & phương thức */}
      {step === 'input' && (
        <div className="flex flex-col gap-5">

          {/* Amount presets */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Chọn số tiền</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {PRESET_AMOUNTS.map(a => (
                <button
                  key={a}
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
          </div>

          {/* Payment method */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Phương thức thanh toán</p>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                    method === m.id
                      ? `${m.borderColor} ${m.bgSelected}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{m.logo}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${method === m.id ? m.textColor : 'text-gray-900'}`}>
                      {m.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                    method === m.id ? `${m.borderColor} ${m.color}` : 'border-gray-300'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Tổng nạp</p>
              <p className="text-2xl font-bold text-blue-700">{formatMoney(finalAmount)}</p>
            </div>
            <button
              disabled={finalAmount < 10_000}
              onClick={() => setStep('confirm')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tiếp tục →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — Xác nhận thanh toán */}
      {step === 'confirm' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">Thông tin thanh toán</p>

            {/* MoMo / VNPay — QR giả */}
            {(method === 'momo' || method === 'vnpay') && (
              <div className="text-center">
                <div className="w-44 h-44 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <p className="text-3xl mb-1">{method === 'momo' ? '📱' : '💳'}</p>
                    <p className="text-xs text-gray-400">QR Code</p>
                    <p className="text-xs text-gray-400">(Hiển thị sau khi</p>
                    <p className="text-xs text-gray-400">kết nối backend)</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Quét mã QR bằng app <strong>{method === 'momo' ? 'MoMo' : 'VNPay'}</strong>
                </p>
                <p className="text-xs text-gray-400">Mã QR có hiệu lực trong <span className="text-red-500 font-medium">15 phút</span></p>
              </div>
            )}

            {/* Bank transfer */}
            {method === 'bank' && (
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Ngân hàng', value: BANK_INFO.bank, copyKey: null },
                  { label: 'Số tài khoản', value: BANK_INFO.account, copyKey: 'account' },
                  { label: 'Tên tài khoản', value: BANK_INFO.name, copyKey: 'name' },
                  { label: 'Chi nhánh', value: BANK_INFO.branch, copyKey: null },
                  { label: 'Nội dung CK', value: `NAP ${finalAmount} SN-2026-00892`, copyKey: 'content' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-500 w-32 flex-shrink-0">{row.label}</span>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-sm font-medium text-gray-900 text-right">{row.value}</span>
                      {row.copyKey && (
                        <button onClick={() => copy(row.value, row.copyKey!)}
                          className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0">
                          {copied === row.copyKey ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                  <p className="text-xs text-yellow-700">
                    ⚠️ Nhập <strong>đúng nội dung chuyển khoản</strong> để hệ thống tự động xác nhận. Nạp tiền sẽ được cộng vào ví trong vòng <strong>5–15 phút</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Amount summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Số tiền nạp</span>
              <span className="text-sm font-semibold text-gray-900">{formatMoney(finalAmount)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">Phí giao dịch</span>
              <span className="text-sm text-green-600 font-medium">Miễn phí</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-900">Số dư sau nạp</span>
              <span className="text-base font-bold text-blue-600">
                {formatMoney(2_430_000 + finalAmount)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('input')}
              className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors">
              Quay lại
            </button>
            {method === 'bank' ? (
              <button onClick={() => setStep('done')}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                Tôi đã chuyển khoản
              </button>
            ) : (
              <button onClick={() => setStep('done')}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                Mở app {method === 'momo' ? 'MoMo' : 'VNPay'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 3 — Done */}
      {step === 'done' && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {method === 'bank' ? 'Đã ghi nhận yêu cầu!' : 'Đang xử lý thanh toán!'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {method === 'bank'
              ? 'Số dư sẽ được cộng vào ví trong 5–15 phút sau khi chuyển khoản thành công.'
              : 'Vui lòng hoàn tất thanh toán trong app. Số dư sẽ được cộng ngay sau khi xác nhận.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/wallet"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              Về ví của tôi
            </Link>
            <button onClick={() => { setStep('input'); setCustomAmount('') }}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors">
              Nạp thêm
            </button>
          </div>
        </div>
      )}
    </div>
  )
}