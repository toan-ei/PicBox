'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Smartphone, Mail, Eye, EyeOff } from 'lucide-react'

type Method = 'sms' | 'email'
type Step = 'choose' | 'input' | 'otp' | 'new-password' | 'done'

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState<Method>('sms')
  const [step, setStep] = useState<Step>('choose')
  const [contact, setContact] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(0)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startCountdown = () => {
    setCountdown(60)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('otp')
    startCountdown()
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp]
      newOtp[index - 1] = ''
      setOtp(newOtp)
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.join('').length < 6) {
      setError('Vui lòng nhập đủ 6 chữ số')
      return
    }
    setError('')
    setStep('new-password')
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!')
      return
    }
    setError('')
    setStep('done')
  }

  const goBack = () => {
    setError('')
    if (step === 'input') setStep('choose')
    else if (step === 'otp') setStep('input')
    else if (step === 'new-password') setStep('otp')
  }

  const maskedContact = method === 'sms'
    ? contact.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
    : contact.replace(/(.{2})(.*)(@.*)/, '$1****$3')

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">

        {/* Back button */}
        {step !== 'done' && (
          <div className="mb-6">
            {step === 'choose' ? (
              <Link href="/auth/login"
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft size={16} /> Quay lại đăng nhập
              </Link>
            ) : (
              <button onClick={goBack}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft size={16} /> Quay lại
              </button>
            )}
          </div>
        )}

        {/* STEP 1 — Chọn phương thức */}
        {step === 'choose' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">Quên mật khẩu?</h1>
              <p className="text-sm text-gray-500 mt-1">
                Chọn cách nhận mã OTP để đặt lại mật khẩu
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => setMethod('sms')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  method === 'sms'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  method === 'sms' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Smartphone size={20} className={method === 'sms' ? 'text-blue-600' : 'text-gray-500'} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Qua SMS</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Gửi mã OTP 6 chữ số đến số điện thoại đã đăng ký
                  </p>
                </div>
                <div className={`ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  method === 'sms' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`} />
              </button>

              <button
                onClick={() => setMethod('email')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  method === 'email'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  method === 'email' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Mail size={20} className={method === 'email' ? 'text-blue-600' : 'text-gray-500'} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Qua Email</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Gửi mã OTP 6 chữ số đến email đã đăng ký
                  </p>
                </div>
                <div className={`ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  method === 'email' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`} />
              </button>
            </div>

            <button
              onClick={() => setStep('input')}
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Tiếp tục
            </button>
          </>
        )}

        {/* STEP 2 — Nhập SĐT hoặc Email */}
        {step === 'input' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">
                {method === 'sms' ? 'Nhập số điện thoại' : 'Nhập địa chỉ email'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {method === 'sms'
                  ? 'Nhập số điện thoại đã đăng ký tài khoản'
                  : 'Nhập email đã đăng ký tài khoản'}
              </p>
            </div>

            <form onSubmit={handleSend} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  {method === 'sms' ? 'Số điện thoại' : 'Email'}
                </label>
                <input
                  type={method === 'sms' ? 'tel' : 'email'}
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  placeholder={method === 'sms' ? '0901234567' : 'example@email.com'}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button type="submit"
                className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">
                Gửi mã OTP
              </button>
            </form>
          </>
        )}

        {/* STEP 3 — Nhập OTP */}
        {step === 'otp' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">Nhập mã OTP</h1>
              <p className="text-sm text-gray-500 mt-1">
                Mã 6 chữ số đã được gửi đến{' '}
                <span className="font-medium text-gray-800">{maskedContact}</span>
                <br />
                Mã có hiệu lực trong{' '}
                <span className="text-red-500 font-medium">5 phút</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              {/* 6 ô OTP */}
              <div className="flex gap-2 justify-between">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className={`w-12 h-13 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-gray-900 ${
                      digit ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-xs text-center -mt-2">{error}</p>
              )}

              <button type="submit"
                className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">
                Xác nhận mã OTP
              </button>

              {/* Gửi lại */}
              <div className="text-center text-sm text-gray-500">
                Không nhận được mã?{' '}
                {countdown > 0 ? (
                  <span className="text-gray-400">Gửi lại sau {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => { startCountdown(); setOtp(['','','','','','']) }}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Gửi lại
                  </button>
                )}
              </div>
            </form>
          </>
        )}

        {/* STEP 4 — Mật khẩu mới */}
        {step === 'new-password' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">Đặt mật khẩu mới</h1>
              <p className="text-sm text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
            </div>

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      error ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              <button type="submit"
                className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">
                Đặt lại mật khẩu
              </button>
            </form>
          </>
        )}

        {/* DONE */}
        {step === 'done' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Đặt lại thành công!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Mật khẩu mới đã được cập nhật. Vui lòng đăng nhập lại.
            </p>
            <Link href="/auth/login"
              className="inline-block bg-blue-600 text-white rounded-lg px-8 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">
              Đăng nhập ngay
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}