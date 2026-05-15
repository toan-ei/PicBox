'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { ToastContainer, useToast } from '@/components/ui/toast'

export default function RegisterPage() {
  const router = useRouter()
  const { success, error, warning } = useToast()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldError('')

    // Validation
    if (!form.name.trim()) {
      warning('Thiếu thông tin', 'Vui lòng nhập họ tên của bạn')
      return
    }
    if (!form.email.trim() && !form.phone.trim()) {
      warning('Thiếu thông tin', 'Vui lòng nhập email hoặc số điện thoại')
      return
    }
    if (form.password.length < 6) {
      warning('Mật khẩu quá ngắn', 'Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    if (form.password !== form.confirmPassword) {
      setFieldError('Mật khẩu xác nhận không khớp!')
      error('Mật khẩu không khớp', 'Vui lòng kiểm tra lại mật khẩu xác nhận')
      return
    }

    setLoading(true)

    try {
      // TODO: Thay bằng API call thực tế
      // const res = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(form),
      // })
      // if (!res.ok) throw new Error((await res.json()).message)

      await new Promise(r => setTimeout(r, 1400))

      // Simulate email already exists
      if (form.email === 'test@test.com') {
        throw new Error('Email này đã được sử dụng')
      }

      success('Đăng ký thành công!', 'Tài khoản đã được tạo. Hãy đăng nhập để tiếp tục')
      setTimeout(() => router.push('/auth/login'), 1200)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại'
      error('Đăng ký thất bại', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer />

      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-blue-600">ShipNow</h1>
            <p className="text-gray-500 text-sm mt-1">Tạo tài khoản mới</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Họ tên</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                disabled={loading}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input
                type="email"
                placeholder="example@email.com"
                disabled={loading}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Số điện thoại</label>
              <input
                type="tel"
                placeholder="0901234567"
                disabled={loading}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={loading}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={loading}
                  onChange={e => {
                    setForm({ ...form, confirmPassword: e.target.value })
                    setFieldError('')
                  }}
                  className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50 ${
                    fieldError ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldError && <p className="text-red-500 text-xs mt-1">{fieldError}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Đã có tài khoản?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Đăng nhập
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}