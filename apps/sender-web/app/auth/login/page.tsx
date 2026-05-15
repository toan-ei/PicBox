'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { ToastContainer, useToast } from '@/components/ui/toast'

export default function LoginPage() {
  const router = useRouter()
  const { success, error } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!email.trim()) {
      error('Thiếu thông tin', 'Vui lòng nhập email hoặc số điện thoại')
      return
    }
    if (!password.trim()) {
      error('Thiếu thông tin', 'Vui lòng nhập mật khẩu')
      return
    }

    setLoading(true)

    try {
      // TODO: Thay bằng API call thực tế
      // const res = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // })
      // if (!res.ok) throw new Error((await res.json()).message)

      // Simulate API delay
      await new Promise(r => setTimeout(r, 1200))

      // Giả lập: sai mật khẩu nếu password = "wrong"
      if (password === 'wrong') {
        throw new Error('Email hoặc mật khẩu không đúng')
      }

      success('Đăng nhập thành công!', 'Chào mừng bạn quay trở lại ShipNow')

      // Redirect sau khi toast hiển thị
      setTimeout(() => router.push('/dashboard'), 1000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra. Vui lòng thử lại'
      error('Đăng nhập thất bại', msg)
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
            <p className="text-gray-500 text-sm mt-1">Đăng nhập vào tài khoản</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Email / Số điện thoại
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Chưa có tài khoản?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
              Đăng ký
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}