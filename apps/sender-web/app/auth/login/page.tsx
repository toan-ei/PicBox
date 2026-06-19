'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { login } from '@/lib/auth-service'

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')   // email hoặc SĐT
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!identifier.trim()) return setError('Vui lòng nhập email hoặc số điện thoại')
    if (!password.trim()) return setError('Vui lòng nhập mật khẩu')

    setLoading(true)
    const result = await login(identifier.trim(), password)

    if (result.ok) {
      router.push('/dashboard')
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">

        {/* Logo */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">ShipNow</h1>
          <p className="text-gray-500 text-sm mt-1">Đăng nhập vào tài khoản của bạn</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Email / Số điện thoại
            </label>
            <input
              type="text"
              value={identifier}
              onChange={e => { setIdentifier(e.target.value); setError('') }}
              placeholder="example@email.com hoặc 0901234567"
              autoComplete="username"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
              <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-gray-900
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold
              hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-60
              flex items-center justify-center gap-2 mt-1"
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Đang đăng nhập...</>
              : 'Đăng nhập'
            }
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Chưa có tài khoản?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:underline font-semibold">
            Đăng ký ngay
          </Link>
        </p>

      </div>
    </main>
  )
}