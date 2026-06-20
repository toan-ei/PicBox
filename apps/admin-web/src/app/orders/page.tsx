"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout";
import { Badge } from "@/components/ui";
import {
  Search, Filter, Eye, Package, Clock, CheckCircle,
  Truck, XCircle, ChevronRight, ArrowUpRight,
} from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "picking" | "delivering" | "delivered" | "failed" | "cancelled";

interface Order {
  id: string;
  customer: string;
  phone: string;
  from: string;
  to: string;
  shipper: string | null;
  amount: number;
  cod: number;
  weight: number;
  status: OrderStatus;
  created: string;
}

const ORDERS: Order[] = [
  { id: "PB-20260001", customer: "Nguyễn Văn A", phone: "0901234567", from: "Quận 1, HCM", to: "Quận 7, HCM", shipper: "Lê Shipper", amount: 35000, cod: 250000, weight: 1.5, status: "delivering", created: "14/05/2026 08:12" },
  { id: "PB-20260002", customer: "Trần Thị B", phone: "0912345678", from: "Bình Thạnh, HCM", to: "Gò Vấp, HCM", shipper: null, amount: 28000, cod: 0, weight: 0.8, status: "pending", created: "14/05/2026 09:05" },
  { id: "PB-20260003", customer: "Lê Văn C", phone: "0923456789", from: "Quận 3, HCM", to: "Thủ Đức, HCM", shipper: "Võ Shipper", amount: 42000, cod: 180000, weight: 2.1, status: "picking", created: "14/05/2026 09:30" },
  { id: "PB-20260004", customer: "Phạm Thị D", phone: "0934567890", from: "Quận 10, HCM", to: "Bình Dương", shipper: "Đặng Driver", amount: 68000, cod: 0, weight: 4.5, status: "delivered", created: "13/05/2026 15:00" },
  { id: "PB-20260005", customer: "Hoàng Văn E", phone: "0945678901", from: "Tân Bình, HCM", to: "Long An", shipper: null, amount: 55000, cod: 320000, weight: 3.0, status: "confirmed", created: "14/05/2026 10:00" },
  { id: "PB-20260006", customer: "Vũ Thị F", phone: "0956789012", from: "Quận 12, HCM", to: "Quận 9, HCM", shipper: "Ngô Shipper", amount: 25000, cod: 90000, weight: 0.5, status: "failed", created: "13/05/2026 14:20" },
  { id: "PB-20260007", customer: "Đỗ Văn G", phone: "0967890123", from: "Nhà Bè, HCM", to: "Quận 4, HCM", shipper: null, amount: 33000, cod: 0, weight: 1.2, status: "cancelled", created: "13/05/2026 11:00" },
  { id: "PB-20260008", customer: "Bùi Thị H", phone: "0978901234", from: "Cần Giờ, HCM", to: "Quận 1, HCM", shipper: "Trần Shipper", amount: 80000, cod: 500000, weight: 6.0, status: "delivering", created: "14/05/2026 07:45" },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: "default" | "success" | "warning" | "danger" | "info"; icon: React.ElementType }> = {
  pending:    { label: "Chờ xử lý",   variant: "default",  icon: Clock },
  confirmed:  { label: "Đã xác nhận", variant: "info",     icon: CheckCircle },
  picking:    { label: "Đang lấy",    variant: "warning",  icon: Package },
  delivering: { label: "Đang giao",   variant: "info",     icon: Truck },
  delivered:  { label: "Hoàn thành",  variant: "success",  icon: CheckCircle },
  failed:     { label: "Thất bại",    variant: "danger",   icon: XCircle },
  cancelled:  { label: "Đã huỷ",     variant: "danger",   icon: XCircle },
};

const STATUS_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xử lý" },
  { key: "delivering", label: "Đang giao" },
  { key: "delivered", label: "Hoàn thành" },
  { key: "failed", label: "Thất bại" },
];

const SUMMARY = [
  { label: "Tổng đơn hôm nay", value: "248", icon: Package, color: "text-indigo-400", bg: "bg-indigo-500/[0.08]" },
  { label: "Đang giao", value: "87", icon: Truck, color: "text-sky-400", bg: "bg-sky-500/[0.08]" },
  { label: "Hoàn thành", value: "143", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/[0.08]" },
  { label: "Thất bại", value: "18", icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/[0.08]" },
];

export default function OrdersPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = ORDERS.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.to.toLowerCase().includes(q);
    const matchTab = tab === "all" || o.status === tab;
    return matchSearch && matchTab;
  });

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-white">Quản lý đơn hàng</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Theo dõi và quản lý tất cả đơn hàng trong hệ thống</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 stagger">
          {SUMMARY.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
                <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={s.color} />
                </div>
                <div>
                  <p className="text-[22px] font-bold text-white leading-none">{s.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã đơn, khách hàng, địa chỉ..."
              className="w-full h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] pl-9 pr-4 text-[13px] text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/40"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                  tab === t.key
                    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                    : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04] hover:text-slate-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table + Detail panel */}
        <div className="flex gap-4">
          {/* Table */}
          <div className={`glass rounded-2xl overflow-hidden flex-1 min-w-0 ${selectedOrder ? "hidden xl:block" : ""}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Mã đơn", "Khách hàng", "Tuyến đường", "Shipper", "Thu hộ", "Trạng thái", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => {
                    const s = STATUS_CONFIG[order.status];
                    const Icon = s.icon;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-500/[0.08] flex items-center justify-center flex-shrink-0">
                              <Package size={13} className="text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-[12px] font-semibold text-white">{order.id}</p>
                              <p className="text-[10px] text-slate-600">{order.created}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-[13px] text-white">{order.customer}</p>
                          <p className="text-[11px] text-slate-500">{order.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-slate-400 flex items-center gap-1">
                            <span className="truncate max-w-[80px]">{order.from}</span>
                            <ChevronRight size={10} className="flex-shrink-0 text-slate-600" />
                            <span className="truncate max-w-[80px]">{order.to}</span>
                          </p>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-slate-400">{order.shipper ?? <span className="text-slate-700 italic">Chưa gán</span>}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-300">
                          {order.cod > 0 ? `₫${order.cod.toLocaleString()}` : <span className="text-slate-700">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${
                            s.variant === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15" :
                            s.variant === "danger"  ? "bg-rose-500/10 text-rose-400 border-rose-500/15" :
                            s.variant === "warning" ? "bg-amber-500/10 text-amber-400 border-amber-500/15" :
                            s.variant === "info"    ? "bg-sky-500/10 text-sky-400 border-sky-500/15" :
                                                      "bg-slate-500/10 text-slate-400 border-slate-500/15"
                          }`}>
                            <Icon size={10} />
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer">
                            <Eye size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-[12px] text-slate-600">Hiển thị {filtered.length} / {ORDERS.length} đơn hàng</p>
              <div className="flex items-center gap-1">
                {[1,2,3].map((p) => (
                  <button key={p} className={`h-7 w-7 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${p===1?"bg-indigo-500/15 text-indigo-400":"text-slate-500 hover:bg-white/[0.04]"}`}>{p}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Order detail panel */}
          {selectedOrder && (
            <div className="w-full xl:w-80 flex-shrink-0 glass rounded-2xl p-5 animate-slideDown">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-white">Chi tiết đơn hàng</h3>
                <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-all">
                  <XCircle size={15} />
                </button>
              </div>

              {/* Status */}
              {(() => {
                const s = STATUS_CONFIG[selectedOrder.status];
                const Icon = s.icon;
                return (
                  <div className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-4 ${
                    s.variant === "success" ? "bg-emerald-500/10 border border-emerald-500/15" :
                    s.variant === "danger"  ? "bg-rose-500/10 border border-rose-500/15" :
                    s.variant === "warning" ? "bg-amber-500/10 border border-amber-500/15" :
                    s.variant === "info"    ? "bg-sky-500/10 border border-sky-500/15" :
                                              "bg-slate-500/10 border border-slate-500/15"
                  }`}>
                    <Icon size={14} className={
                      s.variant === "success" ? "text-emerald-400" :
                      s.variant === "danger"  ? "text-rose-400" :
                      s.variant === "warning" ? "text-amber-400" :
                      s.variant === "info"    ? "text-sky-400" : "text-slate-400"
                    } />
                    <span className="text-[13px] font-semibold text-white">{s.label}</span>
                  </div>
                );
              })()}

              <div className="space-y-3">
                {[
                  { label: "Mã đơn", value: selectedOrder.id },
                  { label: "Khách hàng", value: selectedOrder.customer },
                  { label: "Điện thoại", value: selectedOrder.phone },
                  { label: "Từ", value: selectedOrder.from },
                  { label: "Đến", value: selectedOrder.to },
                  { label: "Shipper", value: selectedOrder.shipper ?? "Chưa gán" },
                  { label: "Cước phí", value: `₫${selectedOrder.amount.toLocaleString()}` },
                  { label: "Thu hộ (COD)", value: selectedOrder.cod > 0 ? `₫${selectedOrder.cod.toLocaleString()}` : "Không có" },
                  { label: "Trọng lượng", value: `${selectedOrder.weight} kg` },
                  { label: "Ngày tạo", value: selectedOrder.created },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-2">
                    <span className="text-[11px] text-slate-600 flex-shrink-0">{row.label}</span>
                    <span className="text-[12px] text-slate-300 text-right">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Status update */}
              {(selectedOrder.status === "pending" || selectedOrder.status === "confirmed") && (
                <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[11px] text-slate-600 mb-2">Cập nhật trạng thái</p>
                  <div className="space-y-2">
                    <button className="w-full h-9 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 text-[12px] font-medium hover:bg-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2">
                      <Truck size={13} /> Gán shipper
                    </button>
                    <button className="w-full h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/15 text-[12px] font-medium hover:bg-rose-500/15 transition-all cursor-pointer flex items-center justify-center gap-2">
                      <XCircle size={13} /> Huỷ đơn
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
