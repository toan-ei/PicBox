'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home, ChevronRight, Package, MapPin, Phone,
  User, Banknote, FileText, ArrowLeft,
  CheckCircle, AlertCircle, Truck, Loader2, Copy, Save
} from 'lucide-react'
import LocationSelector from '@/components/ui/LocationSelector'
import { createOrder, BRANCH_LIST } from '@picbox/utils'
import { getCurrentUser } from '@/lib/auth-service'

interface FormData {
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  receiverProvince: string
  receiverDistrict: string
  receiverWard: string
  packageWeight: string
  packageWidth: string
  packageLength: string
  packageHeight: string
  packageDescription: string
  packageValue: string
  codAmount: string
  paymentSide: 'sender' | 'receiver'
  note: string
  serviceType: 'standard' | 'express' | 'sameday'
  destBranchId: string
}

const SERVICE_OPTIONS = [
  { id: 'standard', label: 'Tiêu chuẩn', time: '2–3 ngày', price: '22.000 đ', fee: 22000, desc: 'Giao hàng trong 2–3 ngày làm việc', icon: Package },
  { id: 'express',  label: 'Nhanh',       time: 'Hôm sau',  price: '35.000 đ', fee: 35000, desc: 'Giao hàng ngay hôm sau trước 12h',  icon: Truck },
  { id: 'sameday',  label: 'Trong ngày',  time: '4–6 tiếng',price: '55.000 đ', fee: 55000, desc: 'Giao trong ngày, nội thành TP.HCM', icon: CheckCircle },
]

const ORIGIN_BRANCH = { id: 'HCM_01', name: 'Chi nhánh TP.HCM - Quận 1' }

const DRAFT_KEY = 'picbox_new_order_draft'

const EMPTY_FORM: FormData = {
  receiverName: '', receiverPhone: '', receiverAddress: '',
  receiverProvince: '', receiverDistrict: '', receiverWard: '',
  packageWeight: '', packageWidth: '', packageLength: '', packageHeight: '',
  packageDescription: '', packageValue: '', codAmount: '',
  paymentSide: 'receiver', note: '', serviceType: 'standard',
  destBranchId: BRANCH_LIST[0]?.id ?? '',
}

const EMPTY_LOCATION = {
  provinceCode: '', provinceName: '', districtCode: '', districtName: '', ward: '', address: ''
}

function isDraftEmpty(f: FormData) {
  const skip = new Set(['paymentSide', 'serviceType', 'destBranchId'])
  return Object.entries(f).every(([k, v]) => skip.has(k) || v === '')
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white
        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-all ${props.className ?? ''}`}
    />
  )
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
        <Icon size={16} className="text-blue-600" />
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export default function NewOrderPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [receiverLocation, setReceiverLocation] = useState(EMPTY_LOCATION)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'general', string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [createdTrackingCode, setCreatedTrackingCode] = useState<string | null>(null)
  const [hasDraft, setHasDraft] = useState(false)

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const { form: savedForm, location: savedLocation } = JSON.parse(raw) as {
        form: FormData
        location: typeof EMPTY_LOCATION
      }
      if (savedForm && !isDraftEmpty(savedForm)) {
        setForm({ ...EMPTY_FORM, ...savedForm })
        if (savedLocation) setReceiverLocation(savedLocation)
        setHasDraft(true)
      }
    } catch { /* ignore corrupt data */ }
  }, [])

  // Auto-save draft whenever form or location changes
  useEffect(() => {
    if (!isDraftEmpty(form)) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, location: receiverLocation }))
    }
  }, [form, receiverLocation])

  // Sync LocationSelector → form address fields
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      receiverProvince: receiverLocation.provinceName,
      receiverDistrict: receiverLocation.districtName,
      receiverWard:     receiverLocation.ward,
      receiverAddress:  receiverLocation.address,
    }))
  }, [receiverLocation])

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      setErrors(er => ({ ...er, [field]: '' }))
    }

  const validate = () => {
    const e: Partial<Record<keyof FormData | 'general', string>> = {}
    if (!form.receiverName.trim())    e.receiverName    = 'Vui lòng nhập tên người nhận'
    if (!form.receiverPhone.trim())   e.receiverPhone   = 'Vui lòng nhập số điện thoại'
    if (!form.receiverProvince)       e.receiverProvince = 'Vui lòng chọn Tỉnh/Thành'
    if (!form.receiverDistrict)       e.receiverDistrict = 'Vui lòng chọn Quận/Huyện'
    if (!form.receiverAddress.trim()) e.receiverAddress  = 'Vui lòng nhập địa chỉ cụ thể'
    if (!form.packageWeight.trim())   e.packageWeight    = 'Vui lòng nhập khối lượng'
    if (!form.destBranchId)           e.destBranchId     = 'Vui lòng chọn chi nhánh đích'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)
    setErrors({})

    try {
      const currentUser = getCurrentUser()
      const destBranch = BRANCH_LIST.find(b => b.id === form.destBranchId) ?? BRANCH_LIST[0]
      const svcFee = SERVICE_OPTIONS.find(s => s.id === form.serviceType)?.fee ?? 22000
      const cod = Number(form.codAmount.replace(/\D/g, '')) || 0

      const order = await createOrder({
        senderName:      currentUser?.name ?? 'Người gửi',
        senderPhone:     currentUser?.phone || '0000000000',
        receiverName:    form.receiverName.trim(),
        receiverPhone:   form.receiverPhone.trim(),
        receiverAddress: [form.receiverAddress, form.receiverWard, form.receiverDistrict, form.receiverProvince]
                           .filter(Boolean).join(', '),
        originBranchId:   ORIGIN_BRANCH.id,
        originBranchName: ORIGIN_BRANCH.name,
        destBranchId:     destBranch.id,
        destBranchName:   destBranch.name,
        weight:  parseFloat(form.packageWeight) || 0,
        width:   parseFloat(form.packageWidth)  || undefined,
        height:  parseFloat(form.packageHeight) || undefined,
        length:  parseFloat(form.packageLength) || undefined,
        fee:     svcFee,
        codAmount: cod || undefined,
        note:    form.note.trim() || undefined,
        pickupMethod: 'PICKUP_AT_BRANCH',
      })

      localStorage.removeItem(DRAFT_KEY)
      setHasDraft(false)
      setCreatedTrackingCode(order.trackingCode)
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Tạo đơn thất bại, vui lòng thử lại' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  const shippingFee = SERVICE_OPTIONS.find(s => s.id === form.serviceType)?.fee ?? 22000
  const codAmount   = Number(form.codAmount.replace(/\D/g, '')) || 0
  const totalCollect = form.paymentSide === 'receiver' ? codAmount + shippingFee : codAmount

  if (createdTrackingCode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Tạo đơn thành công!</h2>
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
          <span className="font-mono text-blue-600 font-bold text-lg">{createdTrackingCode}</span>
          <button
            type="button"
            aria-label="Sao chép mã vận đơn"
            onClick={() => navigator.clipboard.writeText(createdTrackingCode)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Copy size={15} />
          </button>
        </div>
        <p className="text-sm text-gray-500">Mã vận đơn đã được sao chép</p>
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => router.push(`/orders`)}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Về danh sách đơn
          </button>
          <button
            type="button"
            onClick={() => { setCreatedTrackingCode(null); setForm(f => ({ ...f, receiverName: '', receiverPhone: '', codAmount: '', note: '' })) }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Tạo đơn mới
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/dashboard" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
          <Home size={12} /> Trang chủ
        </Link>
        <ChevronRight size={12} className="text-gray-300" />
        <Link href="/orders" className="text-gray-500 hover:text-blue-600 transition-colors font-medium">Đơn hàng</Link>
        <ChevronRight size={12} className="text-gray-300" />
        <span className="text-gray-700 font-medium">Tạo đơn mới</span>
      </nav>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.back()} aria-label="Quay lại"
          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Tạo đơn hàng mới</h1>
      </div>

      {hasDraft && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm">
          <div className="flex items-center gap-2 text-blue-700">
            <Save size={14} className="shrink-0" />
            <span>Đã khôi phục bản nháp — bạn có thể tiếp tục điền thông tin.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(DRAFT_KEY)
              setForm(EMPTY_FORM)
              setReceiverLocation(EMPTY_LOCATION)
              setHasDraft(false)
            }}
            className="shrink-0 text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2 whitespace-nowrap"
          >
            Nhập lại từ đầu
          </button>
        </div>
      )}

      {errors.general && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-5">

          <SectionCard title="Thông tin người nhận" icon={User}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label required>Họ và tên</Label>
                <Input placeholder="Nguyễn Văn A" value={form.receiverName} onChange={set('receiverName')} />
                {errors.receiverName && <p className="mt-1 text-xs text-red-500">{errors.receiverName}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label required>Số điện thoại</Label>
                <Input placeholder="0901234567" value={form.receiverPhone} onChange={set('receiverPhone')} />
                {errors.receiverPhone && <p className="mt-1 text-xs text-red-500">{errors.receiverPhone}</p>}
              </div>
              <div className="sm:col-span-2">
                <LocationSelector value={receiverLocation} onChange={setReceiverLocation} />
                {(errors.receiverProvince || errors.receiverDistrict || errors.receiverAddress) && (
                  <p className="mt-1 text-xs text-red-500">Vui lòng hoàn tất địa chỉ nhận hàng</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <Label required>Chi nhánh đích</Label>
                <select
                  aria-label="Chọn chi nhánh đích"
                  value={form.destBranchId}
                  onChange={set('destBranchId')}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {BRANCH_LIST.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                {errors.destBranchId && <p className="mt-1 text-xs text-red-500">{errors.destBranchId}</p>}
                <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                  <MapPin size={10} /> Bưu cục gửi: {ORIGIN_BRANCH.name}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Thông tin hàng hoá" icon={Package}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <Label required>Khối lượng (kg)</Label>
                <Input type="number" placeholder="1.5" value={form.packageWeight} onChange={set('packageWeight')} />
                {errors.packageWeight && <p className="mt-1 text-xs text-red-500">{errors.packageWeight}</p>}
              </div>
              <div><Label>Dài (cm)</Label><Input type="number" placeholder="20" value={form.packageLength} onChange={set('packageLength')} /></div>
              <div><Label>Rộng (cm)</Label><Input type="number" placeholder="15" value={form.packageWidth} onChange={set('packageWidth')} /></div>
              <div><Label>Cao (cm)</Label><Input type="number" placeholder="10" value={form.packageHeight} onChange={set('packageHeight')} /></div>
              <div>
                <Label>Giá trị hàng (đ)</Label>
                <Input placeholder="500.000" value={form.packageValue} onChange={set('packageValue')} />
              </div>
              <div className="col-span-2 sm:col-span-4">
                <Label>Mô tả hàng hoá</Label>
                <textarea
                  rows={2}
                  placeholder="VD: Quần áo, giày dép, đồ điện tử..."
                  value={form.packageDescription}
                  onChange={set('packageDescription') as React.ChangeEventHandler<HTMLTextAreaElement>}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Thanh toán & COD" icon={Banknote}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Số tiền COD thu hộ (đ)</Label>
                <Input placeholder="Để trống nếu không thu" value={form.codAmount} onChange={set('codAmount')} />
              </div>
              <div className="sm:col-span-2">
                <Label>Người trả phí ship</Label>
                <div className="flex gap-3 mt-1">
                  {([['receiver', 'Người nhận trả'], ['sender', 'Người gửi trả']] as const).map(([val, label]) => (
                    <label key={val} className={`flex-1 flex items-center gap-2.5 px-4 py-3 border rounded-lg cursor-pointer transition-all ${form.paymentSide === val ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                      <input type="radio" checked={form.paymentSide === val} onChange={() => setForm(f => ({ ...f, paymentSide: val }))} />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Ghi chú giao hàng" icon={FileText}>
            <textarea
              rows={3}
              placeholder="Ghi chú cho shipper..."
              value={form.note}
              onChange={set('note') as React.ChangeEventHandler<HTMLTextAreaElement>}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </SectionCard>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
              <Truck size={16} className="text-blue-600" />
              <h2 className="text-sm font-semibold text-gray-800">Dịch vụ giao hàng</h2>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {SERVICE_OPTIONS.map(svc => (
                <label key={svc.id} className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${form.serviceType === svc.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                  <input type="radio" checked={form.serviceType === svc.id} onChange={() => setForm(f => ({ ...f, serviceType: svc.id as 'standard' | 'express' | 'sameday' }))} />
                  <div className="flex-1">
                    <div className="flex justify-between font-semibold text-sm">
                      <span>{svc.label}</span><span>{svc.price}</span>
                    </div>
                    <p className="text-xs text-gray-500">{svc.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
            <h2 className="text-sm font-semibold mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingFee.toLocaleString()} đ</span></div>
              <div className="flex justify-between"><span>COD thu hộ</span><span>{codAmount.toLocaleString()} đ</span></div>
              <div className="border-t pt-3 flex justify-between font-bold text-blue-600 text-base">
                <span>Tổng thu khi giao</span><span>{totalCollect.toLocaleString()} đ</span>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting
                  ? <><Loader2 size={16} className="animate-spin" /> Đang tạo đơn...</>
                  : 'Xác nhận tạo đơn'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
