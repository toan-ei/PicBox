'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home, ChevronRight, Package, MapPin, Phone,
  User, Weight, Banknote, FileText, ArrowLeft,
  CheckCircle, AlertCircle, Truck
} from 'lucide-react'

interface FormData {
  // Người nhận
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  receiverProvince: string
  receiverDistrict: string
  receiverWard: string
  // Hàng hoá
  packageWeight: string
  packageWidth: string
  packageLength: string
  packageHeight: string
  packageDescription: string
  packageValue: string
  // Thanh toán
  codAmount: string
  paymentSide: 'sender' | 'receiver'
  // Ghi chú
  note: string
  // Dịch vụ
  serviceType: 'standard' | 'express' | 'sameday'
}

const PROVINCES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai']
const DISTRICTS_HCM = ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh', 'Tân Bình', 'Gò Vấp', 'Phú Nhuận', 'Thủ Đức']

const SERVICE_OPTIONS = [
  {
    id: 'standard',
    label: 'Tiêu chuẩn',
    time: '2–3 ngày',
    price: '22.000 đ',
    desc: 'Giao hàng trong 2–3 ngày làm việc',
    icon: Package,
  },
  {
    id: 'express',
    label: 'Nhanh',
    time: 'Hôm sau',
    price: '35.000 đ',
    desc: 'Giao hàng ngay hôm sau trước 12h',
    icon: Truck,
  },
  {
    id: 'sameday',
    label: 'Trong ngày',
    time: '4–6 tiếng',
    price: '55.000 đ',
    desc: 'Giao trong ngày, nội thành TP.HCM',
    icon: CheckCircle,
  },
]

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

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
    >
      {children}
    </select>
  )
}

function SectionCard({ title, icon: Icon, children }: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
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
  const [form, setForm] = useState<FormData>({
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    receiverProvince: 'TP. Hồ Chí Minh',
    receiverDistrict: '',
    receiverWard: '',
    packageWeight: '',
    packageWidth: '',
    packageLength: '',
    packageHeight: '',
    packageDescription: '',
    packageValue: '',
    codAmount: '',
    paymentSide: 'receiver',
    note: '',
    serviceType: 'standard',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.receiverName.trim()) e.receiverName = 'Vui lòng nhập tên người nhận'
    if (!form.receiverPhone.trim()) e.receiverPhone = 'Vui lòng nhập số điện thoại'
    else if (!/^0\d{9}$/.test(form.receiverPhone.trim())) e.receiverPhone = 'SĐT không hợp lệ (VD: 0901234567)'
    if (!form.receiverAddress.trim()) e.receiverAddress = 'Vui lòng nhập địa chỉ'
    if (!form.receiverDistrict) e.receiverDistrict = 'Vui lòng chọn quận/huyện'
    if (!form.packageWeight.trim()) e.packageWeight = 'Vui lòng nhập khối lượng'
    else if (isNaN(Number(form.packageWeight)) || Number(form.packageWeight) <= 0) e.packageWeight = 'Khối lượng không hợp lệ'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      // Scroll lên đầu để thấy lỗi
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSubmitted(true)
    // TODO: gọi API tạo đơn
    setTimeout(() => {
      router.push('/orders')
    }, 2000)
  }

  const shippingFee = form.serviceType === 'standard' ? 22000 : form.serviceType === 'express' ? 35000 : 55000
  const codAmount = Number(form.codAmount.replace(/\D/g, '')) || 0
  const totalCollect = form.paymentSide === 'receiver' ? codAmount + shippingFee : codAmount

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Tạo đơn thành công!</h2>
        <p className="text-sm text-gray-500">Đơn hàng đang được xử lý. Bạn sẽ được chuyển về danh sách đơn...</p>
        <div className="w-8 h-1 bg-blue-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/dashboard"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
          <Home size={12} /> Trang chủ
        </Link>
        <ChevronRight size={12} className="text-gray-300" />
        <Link href="/orders" className="text-gray-500 hover:text-blue-600 transition-colors font-medium">Đơn hàng</Link>
        <ChevronRight size={12} className="text-gray-300" />
        <span className="text-gray-700 font-medium">Tạo đơn mới</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}
          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tạo đơn hàng mới</h1>
          <p className="text-xs text-gray-400 mt-0.5">Điền thông tin để tạo đơn giao hàng</p>
        </div>
      </div>

      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Vui lòng kiểm tra lại thông tin:</p>
            <ul className="mt-1 list-disc list-inside text-xs text-red-600 space-y-0.5">
              {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left col - main form */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Người nhận */}
          <SectionCard title="Thông tin người nhận" icon={User}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label required>Họ và tên</Label>
                <Input placeholder="Nguyễn Văn A" value={form.receiverName} onChange={set('receiverName')} />
                {errors.receiverName && <p className="mt-1 text-xs text-red-500">{errors.receiverName}</p>}
              </div>
              <div>
                <Label required>Số điện thoại</Label>
                <Input placeholder="0901234567" value={form.receiverPhone} onChange={set('receiverPhone')} />
                {errors.receiverPhone && <p className="mt-1 text-xs text-red-500">{errors.receiverPhone}</p>}
              </div>
              <div>
                <Label>Tỉnh / Thành phố</Label>
                <Select value={form.receiverProvince} onChange={set('receiverProvince')}>
                  {PROVINCES.map(p => <option key={p}>{p}</option>)}
                </Select>
              </div>
              <div>
                <Label required>Quận / Huyện</Label>
                <Select value={form.receiverDistrict} onChange={set('receiverDistrict')}>
                  <option value="">-- Chọn quận/huyện --</option>
                  {DISTRICTS_HCM.map(d => <option key={d}>{d}</option>)}
                </Select>
                {errors.receiverDistrict && <p className="mt-1 text-xs text-red-500">{errors.receiverDistrict}</p>}
              </div>
              <div>
                <Label>Phường / Xã</Label>
                <Input placeholder="VD: Phường Bến Nghé" value={form.receiverWard} onChange={set('receiverWard')} />
              </div>
              <div className="sm:col-span-2">
                <Label required>Địa chỉ cụ thể</Label>
                <Input placeholder="Số nhà, tên đường..." value={form.receiverAddress} onChange={set('receiverAddress')} />
                {errors.receiverAddress && <p className="mt-1 text-xs text-red-500">{errors.receiverAddress}</p>}
              </div>
            </div>
          </SectionCard>

          {/* Hàng hoá */}
          <SectionCard title="Thông tin hàng hoá" icon={Package}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <Label required>Khối lượng (kg)</Label>
                <Input type="number" placeholder="1.5" min="0.1" step="0.1" value={form.packageWeight} onChange={set('packageWeight')} />
                {errors.packageWeight && <p className="mt-1 text-xs text-red-500">{errors.packageWeight}</p>}
              </div>
              <div>
                <Label>Dài (cm)</Label>
                <Input type="number" placeholder="20" min="1" value={form.packageLength} onChange={set('packageLength')} />
              </div>
              <div>
                <Label>Rộng (cm)</Label>
                <Input type="number" placeholder="15" min="1" value={form.packageWidth} onChange={set('packageWidth')} />
              </div>
              <div>
                <Label>Cao (cm)</Label>
                <Input type="number" placeholder="10" min="1" value={form.packageHeight} onChange={set('packageHeight')} />
              </div>
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
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </SectionCard>

          {/* Thanh toán */}
          <SectionCard title="Thanh toán & COD" icon={Banknote}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Số tiền COD thu hộ (đ)</Label>
                <Input
                  placeholder="250.000 (để trống nếu không thu)"
                  value={form.codAmount}
                  onChange={set('codAmount')}
                />
                <p className="mt-1 text-xs text-gray-400">Để trống nếu không cần thu tiền hộ</p>
              </div>
              <div className="sm:col-span-2">
                <Label>Người trả phí ship</Label>
                <div className="flex gap-3 mt-1">
                  {([['receiver', 'Người nhận trả'], ['sender', 'Người gửi trả']] as const).map(([val, label]) => (
                    <label key={val} className={`flex-1 flex items-center gap-2.5 px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                      form.paymentSide === val
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" name="paymentSide" value={val}
                        checked={form.paymentSide === val}
                        onChange={() => setForm(f => ({ ...f, paymentSide: val }))}
                        className="accent-blue-600" />
                      <span className={`text-sm font-medium ${form.paymentSide === val ? 'text-blue-700' : 'text-gray-700'}`}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Ghi chú */}
          <SectionCard title="Ghi chú giao hàng" icon={FileText}>
            <Label>Ghi chú cho shipper</Label>
            <textarea
              rows={3}
              placeholder="VD: Gọi trước khi giao, để ở bảo vệ nếu không có nhà..."
              value={form.note}
              onChange={set('note') as React.ChangeEventHandler<HTMLTextAreaElement>}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </SectionCard>
        </div>

        {/* Right col - service + summary */}
        <div className="flex flex-col gap-5">

          {/* Dịch vụ */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
              <Truck size={16} className="text-blue-600" />
              <h2 className="text-sm font-semibold text-gray-800">Dịch vụ giao hàng</h2>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {SERVICE_OPTIONS.map(svc => (
                <label key={svc.id} className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                  form.serviceType === svc.id
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input type="radio" name="serviceType" value={svc.id}
                    checked={form.serviceType === svc.id}
                    onChange={() => setForm(f => ({ ...f, serviceType: svc.id as FormData['serviceType'] }))}
                    className="accent-blue-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-sm font-semibold ${form.serviceType === svc.id ? 'text-blue-700' : 'text-gray-800'}`}>{svc.label}</span>
                      <span className="text-sm font-bold text-gray-900">{svc.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{svc.desc}</p>
                    <span className="inline-block mt-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{svc.time}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Tóm tắt */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-6">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-800">Tóm tắt đơn hàng</h2>
            </div>
            <div className="p-5 flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-gray-900">{shippingFee.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>COD thu hộ</span>
                <span className={`font-medium ${codAmount > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {codAmount > 0 ? codAmount.toLocaleString('vi-VN') + ' đ' : '—'}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Người trả phí</span>
                <span className="font-medium text-gray-900">
                  {form.paymentSide === 'receiver' ? 'Người nhận' : 'Người gửi'}
                </span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
                <span className="text-xs text-gray-500">Tổng thu khi giao</span>
                <span className="font-bold text-base text-blue-600">{totalCollect.toLocaleString('vi-VN')} đ</span>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full mt-2 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold
                  hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                Xác nhận tạo đơn
              </button>
              <Link href="/orders"
                className="w-full text-center py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Huỷ bỏ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}