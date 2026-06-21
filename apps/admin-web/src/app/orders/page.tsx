"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AdminLayout } from "@/components/layout";
import { Search, Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, Loader, X } from "lucide-react";
import { getAllAdminOrders, countOrdersByStatus } from "@picbox/utils";
import type { AdminOrder } from "@picbox/utils";

type AdminStatus = "pending" | "confirmed" | "delivering" | "delivered" | "failed" | "cancelled";

const FE_TO_ADMIN: Record<string, AdminStatus> = {
  pending:          "pending",
  confirmed:        "confirmed",
  picked_up:        "delivering",
  in_transit:       "delivering",
  at_hub:           "delivering",
  sorting:          "delivering",
  out_for_delivery: "delivering",
  delivered:        "delivered",
  failed:           "failed",
  returned:         "cancelled",
  cancelled:        "cancelled",
};

const STATUS_CFG: Record<AdminStatus, { label: string; cls: string; icon: React.ElementType }> = {
  pending:    { label: "Chờ xử lý",   cls: "bg-slate-500/10 text-slate-400 border-slate-500/15",   icon: Clock },
  confirmed:  { label: "Đã xác nhận", cls: "bg-sky-500/10 text-sky-400 border-sky-500/15",         icon: CheckCircle },
  delivering: { label: "Đang giao",   cls: "bg-amber-500/10 text-amber-400 border-amber-500/15",   icon: Truck },
  delivered:  { label: "Hoàn thành",  cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15", icon: CheckCircle },
  failed:     { label: "Thất bại",    cls: "bg-rose-500/10 text-rose-400 border-rose-500/15",      icon: XCircle },
  cancelled:  { label: "Đã huỷ",     cls: "bg-rose-500/10 text-rose-400 border-rose-500/15",      icon: XCircle },
};

const TABS = [
  { key: "all",        label: "Tất cả" },
  { key: "pending",    label: "Chờ xử lý" },
  { key: "confirmed",  label: "Đã xác nhận" },
  { key: "delivering", label: "Đang giao" },
  { key: "delivered",  label: "Hoàn thành" },
  { key: "failed",     label: "Thất bại" },
];

const SUMMARY_COLS = [
  { label: "Tổng đơn",    key: "total",      icon: Package,     cls: "text-indigo-400 bg-indigo-500/[0.08]" },
  { label: "Đang giao",   key: "delivering", icon: Truck,       cls: "text-amber-400  bg-amber-500/[0.08]" },
  { label: "Hoàn thành",  key: "delivered",  icon: CheckCircle, cls: "text-emerald-400 bg-emerald-500/[0.08]" },
  { label: "Thất bại",    key: "failed",     icon: XCircle,     cls: "text-rose-400   bg-rose-500/[0.08]" },
] as const;

function fmt(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const [tab, setTab]               = useState("all");
  const [search, setSearch]         = useState(() => searchParams.get("q") ?? "");
  const [selected, setSelected]     = useState<AdminOrder | null>(null);
  const [orders, setOrders]         = useState<AdminOrder[]>([]);
  const [loading, setLoading]       = useState(true);
  const [counts, setCounts]         = useState({ total: 0, delivering: 0, delivered: 0, failed: 0 });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllAdminOrders(),
      countOrdersByStatus("PENDING"),
      countOrdersByStatus("OUT_FOR_DELIVERY"),
      countOrdersByStatus("DELIVERED"),
      countOrdersByStatus("DELIVERY_FAILED"),
    ]).then(([data, p, d, done, f]) => {
      setOrders(data);
      setCounts({ total: p + d + done + f, delivering: d, delivered: done, failed: f });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const st = FE_TO_ADMIN[o.status] ?? "pending";
    return (
      (tab === "all" || st === tab) &&
      (o.trackingCode.toLowerCase().includes(q) ||
       o.senderName.toLowerCase().includes(q) ||
       o.receiverName.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-[18px] font-bold text-white">Quản lý đơn hàng</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Theo dõi và quản lý tất cả đơn hàng trong hệ thống</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {SUMMARY_COLS.map(({ label, key, icon: Icon, cls }) => (
            <div key={key} className="glass rounded-xl p-3.5 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cls.split(" ")[1]}`}>
                <Icon size={16} className={cls.split(" ")[0]} />
              </div>
              <div>
                {loading
                  ? <div className="h-5 w-10 bg-white/[0.06] rounded animate-pulse mb-1" />
                  : <p className="text-[20px] font-bold text-white leading-none">{counts[key]}</p>}
                <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã vận đơn, người gửi, người nhận..."
              className="w-full h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] pl-9 pr-4 text-[13px] text-slate-300 placeholder-slate-600 outline-none focus:border-indigo-500/40"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
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

        {/* Table + Detail */}
        <div className="flex gap-4">
          <div className={`glass rounded-2xl overflow-hidden flex-1 min-w-0 ${selected ? "hidden xl:block" : ""}`}>
            {loading ? (
              <div className="flex items-center justify-center py-14">
                <Loader size={18} className="text-indigo-400 animate-spin" />
                <span className="ml-2 text-[13px] text-slate-500">Đang tải đơn hàng...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Mã vận đơn", "Người gửi", "Tuyến đường", "Người nhận", "COD", "Trạng thái", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-[13px] text-slate-600">
                          Không có đơn hàng nào
                        </td>
                      </tr>
                    ) : filtered.map((order) => {
                      const st = FE_TO_ADMIN[order.status] ?? "pending";
                      const s = STATUS_CFG[st];
                      const Icon = s.icon;
                      const isSelected = selected?.id === order.id;
                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelected(isSelected ? null : order)}
                          className={`cursor-pointer transition-colors border-b border-white/[0.03] ${isSelected ? "bg-indigo-500/[0.06]" : "hover:bg-white/[0.02]"}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-7 w-7 rounded-lg bg-indigo-500/[0.08] flex items-center justify-center flex-shrink-0">
                                <Package size={12} className="text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-[13px] font-semibold text-white">{order.trackingCode}</p>
                                <p className="text-[11px] text-slate-600">{fmt(order.createdAt)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[13px] text-slate-200">{order.senderName}</p>
                            <p className="text-[11px] text-slate-500">{order.senderPhone}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[12px] text-slate-400 flex items-center gap-1">
                              <span className="truncate max-w-[72px]">{order.originBranchName}</span>
                              <ChevronRight size={10} className="flex-shrink-0 text-slate-600" />
                              <span className="truncate max-w-[72px]">{order.destBranchName}</span>
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-[13px] text-slate-200">{order.receiverName}</p>
                            <p className="text-[11px] text-slate-500">{order.receiverPhone}</p>
                          </td>
                          <td className="px-4 py-3 text-[12px] text-slate-300 whitespace-nowrap">
                            {order.codAmount > 0 ? `₫${order.codAmount.toLocaleString()}` : <span className="text-slate-700">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${s.cls}`}>
                              <Icon size={10} />
                              {s.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button type="button" title="Xem chi tiết" className="p-1 rounded-lg text-slate-600 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer">
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
            <div className="px-4 py-2.5 border-t border-white/[0.04]">
              <p className="text-[11px] text-slate-600">Hiển thị {filtered.length} / {orders.length} đơn hàng</p>
            </div>
          </div>

          {/* Detail panel */}
          {selected && (() => {
            const st = FE_TO_ADMIN[selected.status] ?? "pending";
            const s = STATUS_CFG[st];
            const Icon = s.icon;
            return (
              <div className="w-full xl:w-72 flex-shrink-0 glass rounded-2xl p-4 self-start">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-semibold text-white">Chi tiết đơn</h3>
                  <button type="button" title="Đóng" onClick={() => setSelected(null)} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] cursor-pointer">
                    <X size={14} />
                  </button>
                </div>

                <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold border mb-3 ${s.cls}`}>
                  <Icon size={12} /> {s.label}
                </span>

                <div className="space-y-2.5">
                  {[
                    ["Mã vận đơn",  selected.trackingCode],
                    ["Người gửi",   selected.senderName],
                    ["SĐT gửi",     selected.senderPhone],
                    ["Người nhận",  selected.receiverName],
                    ["SĐT nhận",    selected.receiverPhone],
                    ["Địa chỉ",     selected.receiverAddress],
                    ["Tuyến",       `${selected.originBranchName} → ${selected.destBranchName}`],
                    ["Cước phí",    `₫${selected.fee.toLocaleString()}`],
                    ["Thu hộ COD",  selected.codAmount > 0 ? `₫${selected.codAmount.toLocaleString()}` : "Không có"],
                    ["Trọng lượng", `${selected.weight} kg`],
                    ["Ngày tạo",    fmt(selected.createdAt)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-2">
                      <span className="text-[11px] text-slate-600 flex-shrink-0">{label}</span>
                      <span className="text-[12px] text-slate-300 text-right break-words max-w-[160px]">{value}</span>
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
