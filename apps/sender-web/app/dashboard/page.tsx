import {
  Package, PackageCheck, PackageX,
  TrendingUp, Clock, Truck
} from 'lucide-react'

const stats = [
  { label: 'Tổng đơn tháng này', value: '124', icon: Package, color: 'bg-blue-50 text-blue-600' },
  { label: 'Đang giao', value: '18', icon: Truck, color: 'bg-yellow-50 text-yellow-600' },
  { label: 'Đã giao thành công', value: '98', icon: PackageCheck, color: 'bg-green-50 text-green-600' },
  { label: 'Hoàn hàng', value: '8', icon: PackageX, color: 'bg-red-50 text-red-600' },
]

const recentOrders = [
  { id: 'ORD-001', receiver: 'Nguyễn Văn A', address: 'Quận 1, TP.HCM', status: 'Đang giao', statusColor: 'bg-yellow-100 text-yellow-700', time: '10 phút trước' },
  { id: 'ORD-002', receiver: 'Trần Thị B', address: 'Quận 3, TP.HCM', status: 'Đã giao', statusColor: 'bg-green-100 text-green-700', time: '1 giờ trước' },
  { id: 'ORD-003', receiver: 'Lê Văn C', address: 'Bình Thạnh, TP.HCM', status: 'Chờ lấy hàng', statusColor: 'bg-blue-100 text-blue-700', time: '2 giờ trước' },
  { id: 'ORD-004', receiver: 'Phạm Thị D', address: 'Gò Vấp, TP.HCM', status: 'Hoàn hàng', statusColor: 'bg-red-100 text-red-700', time: '3 giờ trước' },
  { id: 'ORD-005', receiver: 'Hoàng Văn E', address: 'Tân Bình, TP.HCM', status: 'Đang giao', statusColor: 'bg-yellow-100 text-yellow-700', time: '4 giờ trước' },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan hoạt động tháng 5/2026</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Revenue + Quick stats */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Doanh thu tháng này</h2>
            <span className="text-xs text-gray-400">Cập nhật realtime</span>
          </div>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-3xl font-bold text-gray-900">4.250.000</span>
            <span className="text-sm text-gray-500 mb-1">đ</span>
            <span className="text-xs text-green-600 font-medium mb-1 ml-1">↑ 12% so với tháng trước</span>
          </div>
          {/* Bar chart giả */}
          <div className="flex items-end gap-1.5 h-24">
            {[40, 65, 50, 80, 55, 90, 70, 85, 60, 95, 75, 100, 80, 70].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-100 rounded-t-sm hover:bg-blue-400 transition-colors"
                style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">1/5</span>
            <span className="text-xs text-gray-400">Hôm nay</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-900">Tỷ lệ giao hàng</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Thành công', percent: 79, color: 'bg-green-500' },
              { label: 'Đang giao', percent: 15, color: 'bg-yellow-400' },
              { label: 'Hoàn hàng', percent: 6, color: 'bg-red-400' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">{item.label}</span>
                  <span className="text-xs font-medium text-gray-900">{item.percent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} className="text-gray-400" />
              <span>Giao đúng hạn: <strong className="text-gray-900">91%</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp size={14} className="text-gray-400" />
              <span>Đánh giá TB: <strong className="text-gray-900">4.8 ⭐</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Đơn hàng gần đây</h2>
          <a href="/orders" className="text-xs text-blue-600 hover:underline">Xem tất cả →</a>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.map(order => (
            <div key={order.id}
              className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package size={15} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{order.id}</p>
                <p className="text-xs text-gray-500 truncate">{order.receiver} · {order.address}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${order.statusColor}`}>
                {order.status}
              </span>
              <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">{order.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}