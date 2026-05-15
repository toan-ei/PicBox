'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

const TOAST_ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const TOAST_STYLES = {
  success: {
    container: 'bg-white border-l-4 border-green-500 shadow-lg shadow-green-100/50',
    icon: 'text-green-500',
    title: 'text-green-800',
    message: 'text-green-600',
    progress: 'bg-green-500',
  },
  error: {
    container: 'bg-white border-l-4 border-red-500 shadow-lg shadow-red-100/50',
    icon: 'text-red-500',
    title: 'text-red-800',
    message: 'text-red-600',
    progress: 'bg-red-500',
  },
  warning: {
    container: 'bg-white border-l-4 border-yellow-500 shadow-lg shadow-yellow-100/50',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
    message: 'text-yellow-600',
    progress: 'bg-yellow-500',
  },
  info: {
    container: 'bg-white border-l-4 border-blue-500 shadow-lg shadow-blue-100/50',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    message: 'text-blue-600',
    progress: 'bg-blue-500',
  },
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const duration = toast.duration ?? 4000
  const Icon = TOAST_ICONS[toast.type]
  const style = TOAST_STYLES[toast.type]

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setVisible(true), 10)
    // Trigger exit animation
    const exitTimer = setTimeout(() => {
      setLeaving(true)
      setTimeout(() => onRemove(toast.id), 300)
    }, duration)
    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
    }
  }, [toast.id, duration, onRemove])

  const handleClose = () => {
    setLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-xl min-w-[320px] max-w-[400px]
        transition-all duration-300 ease-out
        ${style.container}
        ${visible && !leaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <Icon size={20} className={`${style.icon} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${style.title}`}>{toast.title}</p>
        {toast.message && (
          <p className={`text-xs mt-0.5 ${style.message}`}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl overflow-hidden bg-gray-100">
        <div
          className={`h-full ${style.progress} origin-left`}
          style={{
            animation: `toast-shrink ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes toast-shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  )
}

// ---- Toast Container ----
let globalAddToast: ((toast: Omit<Toast, 'id'>) => void) | null = null

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  useEffect(() => {
    globalAddToast = addToast
    return () => { globalAddToast = null }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  )
}

// ---- Hook ----
export function useToast() {
  const toast = (options: Omit<Toast, 'id'>) => {
    if (globalAddToast) globalAddToast(options)
  }

  return {
    toast,
    success: (title: string, message?: string) =>
      toast({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      toast({ type: 'error', title, message }),
    warning: (title: string, message?: string) =>
      toast({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      toast({ type: 'info', title, message }),
  }
}