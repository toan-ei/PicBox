// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — dùng chung cho orders list và orders detail
// Sau này khi có API thật, chỉ cần xoá file này và thay bằng API calls
// ─────────────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending' | 'confirmed' | 'picked_up' | 'in_transit'
  | 'at_hub' | 'out_for_delivery' | 'delivering'
  | 'delivered' | 'failed' | 'returned' | 'cancelled'

export interface OrderSummary {
  id: string
  trackingCode: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  weight: number
  codAmount: number
  shippingFee: number
  status: OrderStatus
  createdAt: string   // ISO string để sort
}

export interface TimelineEvent {
  status: string
  label: string
  time: string
  location?: string
  done: boolean
  active: boolean
}

export interface OrderDetail extends OrderSummary {
  updatedAt: string
  serviceType: string
  estimatedDelivery: string
  sender: { name: string; phone: string; address: string }
  receiver: { name: string; phone: string; address: string; province: string }
  package: { weight: number; description: string; value: number }
  paymentSide: 'sender' | 'receiver'
  note: string
  timeline: TimelineEvent[]
}

// ─── Danh sách đầy đủ 10 đơn — dùng cho orders list ─────────────────────────
export const MOCK_ORDERS: OrderDetail[] = [
  {
    id: '1', trackingCode: 'PB001234',
    receiverName: 'Nguyễn Văn A', receiverPhone: '0901234567',
    receiverAddress: 'Quận 1, TP.HCM',
    weight: 1.5, codAmount: 250000, shippingFee: 30000,
    status: 'out_for_delivery', createdAt: '2026-05-15T08:00:00Z',
    updatedAt: '15/05/2026 14:30', serviceType: 'Nhanh', estimatedDelivery: '15/05/2026',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Nguyễn Văn A', phone: '0901234567', address: '45 Trần Hưng Đạo', province: 'Quận 5, TP.HCM' },
    package: { weight: 1.5, description: 'Quần áo', value: 350000 },
    paymentSide: 'receiver', note: 'Gọi trước khi giao',
    timeline: [
      { status: 'confirmed',        label: 'Đơn hàng được xác nhận',   time: '15/05/2026 08:05', location: 'Hệ thống',         done: true,  active: false },
      { status: 'picked_up',        label: 'Shipper đã lấy hàng',      time: '15/05/2026 10:20', location: 'Quận 1, TP.HCM',   done: true,  active: false },
      { status: 'at_hub',           label: 'Hàng đến bưu cục',         time: '15/05/2026 11:45', location: 'Hub Q.1 - TP.HCM', done: true,  active: false },
      { status: 'out_for_delivery', label: 'Đang giao đến người nhận', time: '15/05/2026 13:30', location: 'Quận 5, TP.HCM',   done: true,  active: true  },
      { status: 'delivered',        label: 'Giao hàng thành công',     time: '—',                location: '',                 done: false, active: false },
    ],
  },
  {
    id: '2', trackingCode: 'PB001235',
    receiverName: 'Trần Thị B', receiverPhone: '0912345678',
    receiverAddress: 'Quận 3, TP.HCM',
    weight: 0.5, codAmount: 0, shippingFee: 20000,
    status: 'delivered', createdAt: '2026-05-15T07:30:00Z',
    updatedAt: '15/05/2026 14:30', serviceType: 'Tiêu chuẩn', estimatedDelivery: '15/05/2026',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Trần Thị B', phone: '0912345678', address: '22 Hai Bà Trưng', province: 'Quận 3, TP.HCM' },
    package: { weight: 0.5, description: 'Mỹ phẩm', value: 0 },
    paymentSide: 'sender', note: '',
    timeline: [
      { status: 'confirmed',        label: 'Đơn hàng được xác nhận',   time: '14/05/2026 09:10', location: 'Hệ thống',         done: true, active: false },
      { status: 'picked_up',        label: 'Shipper đã lấy hàng',      time: '14/05/2026 11:00', location: 'Quận 1, TP.HCM',   done: true, active: false },
      { status: 'at_hub',           label: 'Hàng đến bưu cục',         time: '14/05/2026 13:00', location: 'Hub Q.1 - TP.HCM', done: true, active: false },
      { status: 'out_for_delivery', label: 'Đang giao đến người nhận', time: '15/05/2026 08:00', location: 'Quận 3, TP.HCM',   done: true, active: false },
      { status: 'delivered',        label: 'Giao hàng thành công',     time: '15/05/2026 14:30', location: 'Quận 3, TP.HCM',   done: true, active: true  },
    ],
  },
  {
    id: '3', trackingCode: 'PB001236',
    receiverName: 'Lê Văn C', receiverPhone: '0923456789',
    receiverAddress: 'Bình Thạnh, TP.HCM',
    weight: 2.0, codAmount: 500000, shippingFee: 35000,
    status: 'pending', createdAt: '2026-05-15T07:00:00Z',
    updatedAt: '15/05/2026 07:05', serviceType: 'Nhanh', estimatedDelivery: '16/05/2026',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Lê Văn C', phone: '0923456789', address: '88 Đinh Tiên Hoàng', province: 'Bình Thạnh, TP.HCM' },
    package: { weight: 2, description: 'Điện thoại', value: 5000000 },
    paymentSide: 'receiver', note: '',
    timeline: [
      { status: 'confirmed',        label: 'Đơn hàng được xác nhận',   time: '15/05/2026 07:05', location: 'Hệ thống', done: true,  active: true  },
      { status: 'picked_up',        label: 'Shipper đã lấy hàng',      time: '—', location: '', done: false, active: false },
      { status: 'out_for_delivery', label: 'Đang giao đến người nhận', time: '—', location: '', done: false, active: false },
      { status: 'delivered',        label: 'Giao hàng thành công',     time: '—', location: '', done: false, active: false },
    ],
  },
  {
    id: '4', trackingCode: 'PB001237',
    receiverName: 'Phạm Thị D', receiverPhone: '0934567890',
    receiverAddress: 'Gò Vấp, TP.HCM',
    weight: 3.0, codAmount: 150000, shippingFee: 40000,
    status: 'returned', createdAt: '2026-05-14T15:00:00Z',
    updatedAt: '15/05/2026 10:00', serviceType: 'Tiêu chuẩn', estimatedDelivery: '15/05/2026',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Phạm Thị D', phone: '0934567890', address: '15 Lê Văn Sỹ', province: 'Gò Vấp, TP.HCM' },
    package: { weight: 3, description: 'Mỹ phẩm', value: 200000 },
    paymentSide: 'receiver', note: '',
    timeline: [
      { status: 'confirmed',        label: 'Đơn hàng được xác nhận',       time: '14/05/2026 15:05', location: 'Hệ thống',       done: true, active: false },
      { status: 'picked_up',        label: 'Shipper đã lấy hàng',           time: '14/05/2026 17:00', location: 'Quận 1, TP.HCM', done: true, active: false },
      { status: 'out_for_delivery', label: 'Đang giao đến người nhận',      time: '15/05/2026 09:00', location: 'Gò Vấp, TP.HCM', done: true, active: false },
      { status: 'failed',           label: 'Giao thất bại - Không liên lạc được', time: '15/05/2026 09:45', location: 'Gò Vấp, TP.HCM', done: true, active: false },
      { status: 'returned',         label: 'Đang hoàn hàng về người gửi',  time: '15/05/2026 10:00', location: 'Gò Vấp, TP.HCM', done: true, active: true  },
    ],
  },
  {
    id: '5', trackingCode: 'PB001238',
    receiverName: 'Hoàng Văn E', receiverPhone: '0945678901',
    receiverAddress: 'Tân Bình, TP.HCM',
    weight: 1.0, codAmount: 0, shippingFee: 25000,
    status: 'confirmed', createdAt: '2026-05-14T14:00:00Z',
    updatedAt: '14/05/2026 21:05', serviceType: 'Tiêu chuẩn', estimatedDelivery: '16/05/2026',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Hoàng Văn E', phone: '0945678901', address: '56 Cộng Hòa', province: 'Tân Bình, TP.HCM' },
    package: { weight: 1, description: 'Sách vở', value: 150000 },
    paymentSide: 'sender', note: '',
    timeline: [
      { status: 'confirmed',        label: 'Đơn hàng được xác nhận',   time: '14/05/2026 21:05', location: 'Hệ thống', done: true,  active: true  },
      { status: 'picked_up',        label: 'Shipper đã lấy hàng',      time: '—', location: '', done: false, active: false },
      { status: 'out_for_delivery', label: 'Đang giao đến người nhận', time: '—', location: '', done: false, active: false },
      { status: 'delivered',        label: 'Giao hàng thành công',     time: '—', location: '', done: false, active: false },
    ],
  },
  {
    id: '6', trackingCode: 'PB001239',
    receiverName: 'Võ Thị F', receiverPhone: '0956789012',
    receiverAddress: 'Phú Nhuận, TP.HCM',
    weight: 0.8, codAmount: 320000, shippingFee: 22000,
    status: 'cancelled', createdAt: '2026-05-14T13:00:00Z',
    updatedAt: '14/05/2026 13:30', serviceType: 'Tiêu chuẩn', estimatedDelivery: '—',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Võ Thị F', phone: '0956789012', address: '12 Phan Xích Long', province: 'Phú Nhuận, TP.HCM' },
    package: { weight: 0.8, description: 'Đồ gia dụng', value: 400000 },
    paymentSide: 'receiver', note: '',
    timeline: [
      { status: 'confirmed',  label: 'Đơn hàng được xác nhận', time: '14/05/2026 13:05', location: 'Hệ thống', done: true, active: false },
      { status: 'cancelled',  label: 'Đơn hàng đã bị huỷ',     time: '14/05/2026 13:30', location: 'Hệ thống', done: true, active: true  },
    ],
  },
  {
    id: '7', trackingCode: 'PB001240',
    receiverName: 'Đặng Văn G', receiverPhone: '0967890123',
    receiverAddress: 'Quận 7, TP.HCM',
    weight: 5.0, codAmount: 800000, shippingFee: 55000,
    status: 'in_transit', createdAt: '2026-05-14T10:00:00Z',
    updatedAt: '14/05/2026 18:00', serviceType: 'Trong ngày', estimatedDelivery: '14/05/2026',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Đặng Văn G', phone: '0967890123', address: '99 Nguyễn Thị Thập', province: 'Quận 7, TP.HCM' },
    package: { weight: 5, description: 'Laptop', value: 20000000 },
    paymentSide: 'receiver', note: 'Hàng dễ vỡ, cẩn thận',
    timeline: [
      { status: 'confirmed',  label: 'Đơn hàng được xác nhận', time: '14/05/2026 10:10', location: 'Hệ thống',           done: true, active: false },
      { status: 'picked_up',  label: 'Shipper đã lấy hàng',    time: '14/05/2026 12:00', location: 'Quận 1, TP.HCM',     done: true, active: false },
      { status: 'at_hub',     label: 'Hàng đến bưu cục',       time: '14/05/2026 14:00', location: 'Hub Q.1 - TP.HCM',   done: true, active: false },
      { status: 'in_transit', label: 'Đang vận chuyển liên tỉnh', time: '14/05/2026 18:00', location: 'Hub Tân Sơn Nhất', done: true, active: true  },
      { status: 'delivered',  label: 'Giao hàng thành công',   time: '—', location: '', done: false, active: false },
    ],
  },
  {
    id: '8', trackingCode: 'PB001241',
    receiverName: 'Bùi Thị H', receiverPhone: '0978901234',
    receiverAddress: 'Quận 10, TP.HCM',
    weight: 1.2, codAmount: 0, shippingFee: 28000,
    status: 'out_for_delivery', createdAt: '2026-05-14T09:00:00Z',
    updatedAt: '15/05/2026 09:00', serviceType: 'Tiêu chuẩn', estimatedDelivery: '15/05/2026',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Bùi Thị H', phone: '0978901234', address: '34 Lý Thường Kiệt', province: 'Quận 10, TP.HCM' },
    package: { weight: 1.2, description: 'Thực phẩm chức năng', value: 600000 },
    paymentSide: 'sender', note: '',
    timeline: [
      { status: 'confirmed',        label: 'Đơn hàng được xác nhận',   time: '14/05/2026 09:10', location: 'Hệ thống',         done: true, active: false },
      { status: 'picked_up',        label: 'Shipper đã lấy hàng',      time: '14/05/2026 11:30', location: 'Quận 1, TP.HCM',   done: true, active: false },
      { status: 'at_hub',           label: 'Hàng đến bưu cục',         time: '14/05/2026 14:00', location: 'Hub Q.1 - TP.HCM', done: true, active: false },
      { status: 'out_for_delivery', label: 'Đang giao đến người nhận', time: '15/05/2026 09:00', location: 'Quận 10, TP.HCM',  done: true, active: true  },
      { status: 'delivered',        label: 'Giao hàng thành công',     time: '—', location: '', done: false, active: false },
    ],
  },
  {
    id: '9', trackingCode: 'PB001242',
    receiverName: 'Ngô Văn I', receiverPhone: '0989012345',
    receiverAddress: 'Quận 12, TP.HCM',
    weight: 2.5, codAmount: 450000, shippingFee: 38000,
    status: 'picked_up', createdAt: '2026-05-13T16:00:00Z',
    updatedAt: '13/05/2026 19:00', serviceType: 'Tiêu chuẩn', estimatedDelivery: '15/05/2026',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Ngô Văn I', phone: '0989012345', address: '78 Nguyễn Ảnh Thủ', province: 'Quận 12, TP.HCM' },
    package: { weight: 2.5, description: 'Giày dép', value: 800000 },
    paymentSide: 'receiver', note: 'Để lại bảo vệ nếu không có nhà',
    timeline: [
      { status: 'confirmed', label: 'Đơn hàng được xác nhận', time: '13/05/2026 16:10', location: 'Hệ thống',         done: true, active: false },
      { status: 'picked_up', label: 'Shipper đã lấy hàng',    time: '13/05/2026 19:00', location: 'Quận 1, TP.HCM',   done: true, active: true  },
      { status: 'at_hub',           label: 'Hàng đến bưu cục',         time: '—', location: '', done: false, active: false },
      { status: 'out_for_delivery', label: 'Đang giao đến người nhận', time: '—', location: '', done: false, active: false },
      { status: 'delivered',        label: 'Giao hàng thành công',     time: '—', location: '', done: false, active: false },
    ],
  },
  {
    id: '10', trackingCode: 'PB001243',
    receiverName: 'Dương Thị K', receiverPhone: '0990123456',
    receiverAddress: 'Thủ Đức, TP.HCM',
    weight: 0.3, codAmount: 180000, shippingFee: 18000,
    status: 'failed', createdAt: '2026-05-13T11:00:00Z',
    updatedAt: '13/05/2026 16:00', serviceType: 'Tiêu chuẩn', estimatedDelivery: '13/05/2026',
    sender: { name: 'Công ty ABC', phone: '0281234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    receiver: { name: 'Dương Thị K', phone: '0990123456', address: '24 Kha Vạn Cân', province: 'Thủ Đức, TP.HCM' },
    package: { weight: 0.3, description: 'Tài liệu', value: 0 },
    paymentSide: 'receiver', note: '',
    timeline: [
      { status: 'confirmed',        label: 'Đơn hàng được xác nhận',   time: '13/05/2026 11:10', location: 'Hệ thống',         done: true, active: false },
      { status: 'picked_up',        label: 'Shipper đã lấy hàng',      time: '13/05/2026 13:00', location: 'Quận 1, TP.HCM',   done: true, active: false },
      { status: 'out_for_delivery', label: 'Đang giao đến người nhận', time: '13/05/2026 15:00', location: 'Thủ Đức, TP.HCM',  done: true, active: false },
      { status: 'failed',           label: 'Giao thất bại - Người nhận vắng', time: '13/05/2026 16:00', location: 'Thủ Đức, TP.HCM', done: true, active: true },
    ],
  },
]

// ─── Lookup map để detail page tìm nhanh theo id ──────────────────────────────
export const ORDERS_BY_ID: Record<string, OrderDetail> =
  Object.fromEntries(MOCK_ORDERS.map(o => [o.id, o]))

// ─────────────────────────────────────────────────────────────────────────────
// RUNTIME ORDER STORE — lưu đơn mới tạo vào localStorage
// Khi có backend: xoá phần này, thay bằng API POST /orders
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME_ORDERS_KEY = 'shipnow_runtime_orders'

function getRuntimeOrders(): OrderDetail[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RUNTIME_ORDERS_KEY) ?? '[]')
  } catch { return [] }
}

function saveRuntimeOrders(orders: OrderDetail[]) {
  localStorage.setItem(RUNTIME_ORDERS_KEY, JSON.stringify(orders))
}

/** Lấy tất cả đơn = mock cố định + đơn mới tạo trong runtime */
export function getAllOrders(): OrderDetail[] {
  const runtime = getRuntimeOrders()
  return [...runtime, ...MOCK_ORDERS]   // đơn mới nhất lên đầu
}

/** Tìm đơn theo id — tìm trong runtime trước, sau đó mock */
export function getOrderById(id: string): OrderDetail | undefined {
  const runtime = getRuntimeOrders()
  return runtime.find(o => o.id === id) ?? ORDERS_BY_ID[id]
}

/** Tạo đơn mới — thêm vào localStorage */
export interface NewOrderInput {
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  receiverProvince: string
  receiverDistrict: string
  receiverWard: string
  packageWeight: number
  packageDescription: string
  packageValue: number
  codAmount: number
  shippingFee: number
  paymentSide: 'sender' | 'receiver'
  serviceType: 'standard' | 'express' | 'sameday'
  note: string
}

export function addOrder(input: NewOrderInput): OrderDetail {
  const runtime = getRuntimeOrders()

  // Tạo mã vận đơn tự động
  const allCount = runtime.length + MOCK_ORDERS.length
  const trackingCode = `PB${String(1244 + allCount).padStart(6, '0')}`
  const now = new Date()
  const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  const dateTimeStr = `${dateStr} ${timeStr}`

  // Tính ngày giao dự kiến
  const deliveryDays = input.serviceType === 'sameday' ? 0 : input.serviceType === 'express' ? 1 : 2
  const deliveryDate = new Date(now)
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays)
  const estimatedDelivery = deliveryDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const serviceLabel = { standard: 'Tiêu chuẩn', express: 'Nhanh', sameday: 'Trong ngày' }[input.serviceType]

  const receiverFullAddress = [input.receiverAddress, input.receiverWard, input.receiverDistrict]
    .filter(Boolean).join(', ')
  const receiverProvince = input.receiverProvince

  const newOrder: OrderDetail = {
    id: `runtime_${Date.now()}`,
    trackingCode,
    receiverName: input.receiverName,
    receiverPhone: input.receiverPhone,
    receiverAddress: `${input.receiverDistrict}, ${input.receiverProvince}`,
    weight: input.packageWeight,
    codAmount: input.codAmount,
    shippingFee: input.shippingFee,
    status: 'pending',
    createdAt: now.toISOString(),
    updatedAt: dateTimeStr,
    serviceType: serviceLabel,
    estimatedDelivery,
    sender: {
      name: 'Tài khoản của tôi',   // sau này lấy từ getCurrentUser()
      phone: '',
      address: '',
    },
    receiver: {
      name: input.receiverName,
      phone: input.receiverPhone,
      address: receiverFullAddress,
      province: receiverProvince,
    },
    package: {
      weight: input.packageWeight,
      description: input.packageDescription,
      value: input.packageValue,
    },
    paymentSide: input.paymentSide,
    note: input.note,
    timeline: [
      {
        status: 'confirmed',
        label: 'Đơn hàng đã được tạo',
        time: dateTimeStr,
        location: 'Hệ thống',
        done: true,
        active: true,
      },
      { status: 'picked_up',        label: 'Shipper lấy hàng',          time: '—', location: '', done: false, active: false },
      { status: 'out_for_delivery', label: 'Đang giao đến người nhận',  time: '—', location: '', done: false, active: false },
      { status: 'delivered',        label: 'Giao hàng thành công',      time: '—', location: '', done: false, active: false },
    ],
  }

  saveRuntimeOrders([newOrder, ...runtime])
  return newOrder
}