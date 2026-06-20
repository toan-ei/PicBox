"use client";

import { AdminLayout } from "@/components/layout";
import { StatCard } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Package, Users, Truck, TrendingUp, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger">
          <StatCard
            title="Tổng đơn hàng"
            value="12,847"
            change="↑ 12.5% so với tuần trước"
            changeType="positive"
            icon={<Package size={22} />}
          />
          <StatCard
            title="Người dùng"
            value="3,241"
            change="↑ 8.2% so với tuần trước"
            changeType="positive"
            icon={<Users size={22} />}
          />
          <StatCard
            title="Shipper hoạt động"
            value="186"
            change="↓ 2.1% so với hôm qua"
            changeType="negative"
            icon={<Truck size={22} />}
          />
          <StatCard
            title="Doanh thu tháng"
            value="₫2.4B"
            change="↑ 18.3% so với tháng trước"
            changeType="positive"
            icon={<TrendingUp size={22} />}
          />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent orders */}
          <div className="lg:col-span-2 rounded-2xl glass p-5 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[19px] font-semibold text-white">Đơn hàng gần đây</h3>
              <button className="text-[16px] text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors cursor-pointer">
                Xem tất cả <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="space-y-3.5">
              {[
                { id: "PB-20241201", status: "Đang giao", customer: "Nguyễn Văn A", amount: "₫125,000", time: "5 phút trước", variant: "info" as const },
                { id: "PB-20241200", status: "Đã nhận", customer: "Trần Thị B", amount: "₫89,000", time: "12 phút trước", variant: "warning" as const },
                { id: "PB-20241199", status: "Hoàn thành", customer: "Lê Văn C", amount: "₫210,000", time: "25 phút trước", variant: "success" as const },
                { id: "PB-20241198", status: "Đang xử lý", customer: "Phạm Thị D", amount: "₫45,000", time: "30 phút trước", variant: "default" as const },
                { id: "PB-20241197", status: "Hoàn thành", customer: "Hoàng Văn E", amount: "₫320,000", time: "1 giờ trước", variant: "success" as const },
              ].map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] p-3.5 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/[0.08] flex items-center justify-center group-hover:bg-indigo-500/[0.12] transition-colors">
                      <Package size={20} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[17px] font-semibold text-white">{order.id}</p>
                      <p className="text-[15px] text-slate-500">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
                    <span className="text-[17px] font-medium text-slate-300 hidden sm:block">{order.amount}</span>
                    <Badge variant={order.variant}>{order.status}</Badge>
                    <span className="text-[15px] text-slate-600 hidden md:block w-24 text-right">{order.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System status */}
          <div className="rounded-2xl glass p-5 animate-fadeIn">
            <h3 className="text-[19px] font-semibold text-white mb-6">Trạng thái hệ thống</h3>
            <div className="space-y-4">
              {[
                { name: "Gateway API", status: "online", uptime: "99.9%" },
                { name: "Identity Service", status: "online", uptime: "99.8%" },
                { name: "Order Service", status: "online", uptime: "99.7%" },
                { name: "Payment Service", status: "online", uptime: "99.9%" },
                { name: "Tracking Service", status: "online", uptime: "99.5%" },
                { name: "Notification", status: "degraded", uptime: "98.2%" },
                { name: "Kafka Cluster", status: "online", uptime: "99.9%" },
                { name: "Redis Cache", status: "online", uptime: "100%" },
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        svc.status === "online"
                          ? "bg-emerald-400 shadow-sm shadow-emerald-400/40"
                          : "bg-amber-400 shadow-sm shadow-amber-400/40 animate-pulse"
                      }`}
                    />
                    <span className="text-[17px] text-slate-300">{svc.name}</span>
                  </div>
                  <span className="text-[15px] text-slate-600 font-mono">{svc.uptime}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
