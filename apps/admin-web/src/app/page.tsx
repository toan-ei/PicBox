"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout";
import { StatCard, Badge } from "@/components/ui";
import { Package, Users, Truck, TrendingUp, ArrowUpRight, Loader } from "lucide-react";
import { getDashboardStats, getAllAdminOrders } from "@picbox/utils";
import type { DashboardStats, AdminOrder } from "@picbox/utils";

const STATUS_LABEL: Record<string, { label: string; variant: "default" | "success" | "warning" | "info" | "danger" }> = {
  pending:          { label: "Chờ xử lý",   variant: "default" },
  confirmed:        { label: "Đã xác nhận", variant: "info" },
  picked_up:        { label: "Đang lấy",    variant: "warning" },
  in_transit:       { label: "Vận chuyển",  variant: "info" },
  at_hub:           { label: "Tại hub",     variant: "info" },
  sorting:          { label: "Phân loại",   variant: "warning" },
  out_for_delivery: { label: "Đang giao",   variant: "info" },
  delivered:        { label: "Hoàn thành",  variant: "success" },
  failed:           { label: "Thất bại",    variant: "danger" },
  returned:         { label: "Đã hoàn",     variant: "danger" },
  cancelled:        { label: "Đã huỷ",      variant: "danger" },
};

function formatCurrency(n: number) {
  if (n >= 1_000_000_000) return `₫${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `₫${(n / 1_000_000).toFixed(0)}M`;
  return `₫${n.toLocaleString()}`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

export default function DashboardPage() {
  const [stats, setStats]               = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getAllAdminOrders()])
      .then(([s, orders]) => { setStats(s); setRecentOrders(orders.slice(0, 6)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = recentOrders.reduce((s, o) => s + o.fee, 0);

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Tổng đơn hàng"     value={loading ? "…" : String(stats?.totalOrders ?? 0)}    change={loading ? "" : `${stats?.deliveredOrders ?? 0} đã hoàn thành`} changeType="positive" icon={<Package size={20} />} />
          <StatCard title="Người dùng"         value={loading ? "…" : String(stats?.totalUsers ?? 0)}     change="Tổng khách hàng"    changeType="positive" icon={<Users size={20} />} />
          <StatCard title="Shipper hệ thống"   value={loading ? "…" : String(stats?.totalShippers ?? 0)} change="Đang trong hệ thống" changeType="positive" icon={<Truck size={20} />} />
          <StatCard title="Doanh thu ước tính" value={loading ? "…" : formatCurrency(totalRevenue)}       change="Từ đơn đã ghi nhận" changeType="positive" icon={<TrendingUp size={20} />} />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent orders */}
          <div className="lg:col-span-2 rounded-2xl glass p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-white">Đơn hàng gần đây</h3>
              <a href="/orders" className="text-[12px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                Xem tất cả <ArrowUpRight size={11} />
              </a>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader size={16} className="text-indigo-400 animate-spin" />
                <span className="ml-2 text-[13px] text-slate-500">Đang tải...</span>
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-center text-[13px] text-slate-600 py-8">Chưa có đơn hàng nào</p>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => {
                  const sv = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending;
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] px-3.5 py-2.5 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500/[0.08] flex items-center justify-center flex-shrink-0">
                          <Package size={14} className="text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-white truncate">{order.trackingCode}</p>
                          <p className="text-[11px] text-slate-500 truncate">{order.senderName} → {order.receiverName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-[12px] font-medium text-slate-300 hidden sm:block">{formatCurrency(order.fee)}</span>
                        <Badge variant={sv.variant}>{sv.label}</Badge>
                        <span className="text-[11px] text-slate-600 hidden md:block w-20 text-right">{timeAgo(order.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* System status */}
          <div className="rounded-2xl glass p-5">
            <h3 className="text-[15px] font-semibold text-white mb-4">Trạng thái hệ thống</h3>
            <div className="space-y-3">
              {[
                "Gateway API", "Identity Service", "Order Service",
                "Payment Service", "Tracking Service", "Notification", "Kafka", "Redis",
              ].map((svc) => (
                <div key={svc} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/40" />
                    <span className="text-[13px] text-slate-300">{svc}</span>
                  </div>
                  <span className="text-[11px] text-emerald-500 font-mono">Online</span>
                </div>
              ))}
            </div>

            {!loading && stats && (
              <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-2.5">
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Thống kê nhanh</p>
                {[
                  { label: "Đang giao",  value: stats.deliveringOrders, color: "text-sky-400" },
                  { label: "Hoàn thành", value: stats.deliveredOrders,  color: "text-emerald-400" },
                  { label: "Thất bại",   value: stats.failedOrders,     color: "text-rose-400" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-500">{row.label}</span>
                    <span className={`text-[13px] font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
