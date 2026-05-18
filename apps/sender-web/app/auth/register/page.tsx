'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { mockRegister } from '@/lib/mock-auth'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Ít nhất 8 ký tự', ok: password.length >= 8 },
    { label: 'Có chữ hoa', ok: /[A-Z]/.test(password) },
    { label: 'Có số', ok: /\d/.test(password) },
  ]
  const strength = checks.filter(c => c.ok).length
  const barColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-green-500'][strength]
  const label = ['', 'Yếu', 'Trung bình', 'Mạnh'][strength]
  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? barColor : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {checks.map(c => (
          <span key={c.label} className={`text-[11px] flex items-center gap-1 ${c.ok ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle size={10} /> {c.label}
          </span>
        ))}
        <span className="ml-auto text-[11px] font-medium text-gray-500">{label}</span>
      </div>
    </div>
  )
}

const inputCls = (hasError: boolean) =>
  `w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
  ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`

export default function RegisterPage() {
  const router = useRouter()

  // State riêng cho từng field — tránh re-render cả form gây mất focus
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const clearErr = (field: string) =>
    setErrors(prev => ({ ...prev, [field]: '', general: '' }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Vui lòng nhập họ tên'
    if (!email.trim()) e.email = 'Vui lòng nhập email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email không hợp lệ'
    if (!phone.trim()) e.phone = 'Vui lòng nhập số điện thoại'
    else if (!/^0\d{9}$/.test(phone)) e.phone = 'SĐT không hợp lệ (VD: 0901234567)'
    if (!password) e.password = 'Vui lòng nhập mật khẩu'
    else if (password.length < 6) e.password = 'Mật khẩu tối thiểu 6 ký tự'
    if (!confirmPassword) e.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    else if (password !== confirmPassword) e.confirmPassword = 'Mật khẩu xác nhận không khớp'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = mockRegister({ name: name.trim(), email: email.trim(), phone: phone.trim(), password })
    if (result.ok) {
      router.push('/auth/login?registered=1')
    } else {
      setErrors({ general: result.error })
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">

        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">ShipNow</h1>
          <p className="text-gray-500 text-sm mt-1">Tạo tài khoản để bắt đầu gửi hàng</p>
        </div>

        {errors.general && (
          <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Họ và tên</label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={e => { setName(e.target.value); clearErr('name') }}
              className={inputCls(!!errors.name)}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); clearErr('email') }}
              autoComplete="email"
              className={inputCls(!!errors.email)}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Số điện thoại</label>
            <input
              type="tel"
              placeholder="0901234567"
              value={phone}
              onChange={e => { setPhone(e.target.value); clearErr('phone') }}
              className={inputCls(!!errors.phone)}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={e => { setPassword(e.target.value); clearErr('password') }}
                autoComplete="new-password"
                className={inputCls(!!errors.password)}
              />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password
              ? <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              : <PasswordStrength password={password} />
            }
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Xác nhận mật khẩu</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); clearErr('confirmPassword') }}
                autoComplete="new-password"
                className={inputCls(!!errors.confirmPassword)}
              />
              <button type="button" onClick={() => setShowConfirm(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold mt-1
              hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-60
              flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Đang tạo tài khoản...</>
              : 'Tạo tài khoản'
            }
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Đã có tài khoản?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  )
}