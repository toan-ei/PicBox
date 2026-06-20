"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout";
import {
  Search, Package, Clock, CheckCircle,
  Truck, XCircle, ChevronRight, Loader,
} from "lucide-react";
import { getAllAdminOrders, countOrdersByStatus } from "@picbox/utils";
import type { AdminOrder } from "@picbox/utils";

type AdminStatus =
  | "pending" | "confirmed" | "picking"
  | "delivering" | "delivered" | "failed" | "cancelled";

const BE_TO_ADMIN: Record<string, AdminStatus> = {
  pending:          "pending",
  confirmed:        "confirmed",
  picked_up:        "picking",
  in_transit:       "delivering",
  at_hub:           "delivering",
  sorting:          "delivering",
  out_for_delivery: "delivering",
  delivered:        "delivered",
  failed:           "failed",
  returned:         "cancelled",
  cancelled:        "cancelled",
};

function toAdminStatus(feStatus: string): AdminStatus {
  return BE_TO_ADMIN[feStatus] ?? "pending";
}

const STATUS_CONFIG: Record<AdminStatus, {
  label: string;
  variant: "default" | "success" | "warning" | "danger" | "info";
  icon: React.ElementType;
}> = {
  pending:    { label: "Chờ xử lý",   variant: "default",  icon: Clock },
  confirmed:  { label: "Đã xác nhận", variant: "info",     icon: CheckCircle },
  picking:    { label: "Đang lấy",    variant: "warning",  icon: Package },
  delivering: { label: "Đang giao",   variant: "info",     icon: Truck },
  delivered:  { label: "Hoàn thành",  variant: "success",  icon: CheckCircle },
  failed:     { label: "Thất bại",    variant: "danger",   icon: XCircle },
  cancelled:  { label: "Đã huỷ",     variant: "danger",   icon: XCircle },
};

const STATUS_TABS = [
  { key: "all",       label: "Tất cả" },
  { key: "pending",   label: "Chờ xử lý" },
  { key: "delivering",label: "Đang giao" },
  { key: "delivered", label: "Hoàn thành" },
  { key: "failed",    label: "Thất bại" },
];

function formatDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function OrdersPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, delivering: 0, delivered: 0, failed: 0 });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllAdminOrders(),
      countOrdersByStatus("PENDING"),
      countOrdersByStatus("OUT_FOR_DELIVERY"),
      countOrdersByStatus("DELIVERED"),
      countOrdersByStatus("DELIVERY_FAILED"),
    ]).then(([data, pending, delivering, delivered, failed]) => {
      setOrders(data);
      setStats({
        total: pending + delivering + delivered + failed,
        delivering,
        delivered,
        failed,
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const adminStatus = toAdminStatus(o.status);
    const matchSearch =
      o.trackingCode.toLowerCase().includes(q) ||
      o.senderName.toLowerCase().includes(q) ||
      o.receiverName.toLowerCase().includes(q) ||
      o.receiverAddress.toLowerCase().includes(q);
    const matchTab =
      tab === "all" ||
      adminStatus === tab;
    return matchSearch && matchTab;
  });

  const SUMMARY = [
    { label: "Tổng đơn hôm nay", value: String(stats.total), icon: Package, color: "text-indigo-400", bg: "bg-indigo-500/[0.08]" },
    { label: "Đang giao",        value: String(stats.delivering), icon: Truck,   color: "text-sky-400",    bg: "bg-sky-500/[0.08]" },
    { label: "Hoàn thành",       value: String(stats.delivered),  icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/[0.08]" },
    { label: "Thất bại",         value: String(stats.failed),     icon: XCircle, color: "text-rose-400",   bg: "bg-rose-500/[0.08]" },
  ];

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
                  {loading ? (
                    <div className="h-6 w-12 bg-white/[0.06] rounded animate-pulse" />
                  ) : (
                    <p className="text-[22px] font-bold text-white leading-none">{s.value}</p>
                  )}
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
              placeholder="Tìm mã vận đơn, người gửi, người nhận..."
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
          <div className={`glass rounded-2xl overflow-hidden flex-1 min-w-0 ${selectedOrder ? "hidden xl:block" : ""}`}>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader size={20} className="text-indigo-400 animate-spin" />
                <span className="ml-2 text-[13px] text-slate-500">Đang tải đơn hàng...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Mã vận đơn", "Người gửi", "Tuyến đường", "Người nhận", "Thu hộ", "Trạng thái", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-slate-600">
                          Không có đơn hàng nào
                        </td>
                      </tr>
                    ) : filtered.map((order) => {
                      const adminStatus = toAdminStatus(order.status);
                      const s = STATUS_CONFIG[adminStatus];
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
                                <p className="text-[12px] font-semibold text-white">{order.trackingCode}</p>
                                <p className="text-[10px] text-slate-600">{formatDate(order.createdAt)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[13px] text-white">{order.senderName}</p>
                            <p className="text-[11px] text-slate-500">{order.senderPhone}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[12px] text-slate-400 flex items-center gap-1">
                              <span className="truncate max-w-[80px]">{order.originBranchName}</span>
                              <ChevronRight size={10} className="flex-shrink-0 text-slate-600" />
                              <span className="truncate max-w-[80px]">{order.destBranchName}</span>
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[13px] text-white">{order.receiverName}</p>
                            <p className="text-[11px] text-slate-500">{order.receiverPhone}</p>
                          </td>
                          <td className="px-4 py-3 text-[12px] text-slate-300">
                            {order.codAmount > 0 ? `₫${order.codAmount.toLocaleString()}` : <span className="text-slate-700">—</span>}
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
                            <button type="button" title="Xem chi tiết" className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer">
                              <ChevronRight size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-[12px] text-slate-600">Hiển thị {filtered.length} / {orders.length} đơn hàng</p>
            </div>
          </div>

          {/* Order detail panel */}
          {selectedOrder && (() => {
            const adminStatus = toAdminStatus(selectedOrder.status);
            const s = STATUS_CONFIG[adminStatus];
            const Icon = s.icon;
            return (
              <div className="w-full xl:w-80 flex-shrink-0 glass rounded-2xl p-5 animate-slideDown">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-semibold text-white">Chi tiết đơn hàng</h3>
                  <button type="button" title="Đóng" onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-all">
                    <XCircle size={15} />
                  </button>
                </div>

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

                <div className="space-y-3">
                  {[
                    { label: "Mã vận đơn",   value: selectedOrder.trackingCode },
                    { label: "Người gửi",     value: selectedOrder.senderName },
                    { label: "SĐT gửi",       value: selectedOrder.senderPhone },
                    { label: "Người nhận",    value: selectedOrder.receiverName },
                    { label: "SĐT nhận",      value: selectedOrder.receiverPhone },
                    { label: "Địa chỉ nhận",  value: selectedOrder.receiverAddress },
                    { label: "Tuyến",         value: `${selectedOrder.originBranchName} → ${selectedOrder.destBranchName}` },
                    { label: "Cước phí",      value: `₫${selectedOrder.fee.toLocaleString()}` },
                    { label: "Thu hộ (COD)",  value: selectedOrder.codAmount > 0 ? `₫${selectedOrder.codAmount.toLocaleString()}` : "Không có" },
                    { label: "Trọng lượng",   value: `${selectedOrder.weight} kg` },
                    { label: "Ngày tạo",      value: formatDate(selectedOrder.createdAt) },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-2">
                      <span className="text-[11px] text-slate-600 flex-shrink-0">{row.label}</span>
                      <span className="text-[12px] text-slate-300 text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </AdminLayout>
  );
}
