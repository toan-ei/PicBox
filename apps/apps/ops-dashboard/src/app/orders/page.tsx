"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package, Truck, Clock, CheckCircle, XCircle, Search,
  ChevronRight, LayoutDashboard, MapPin, BarChart3, Activity, Users, Bell,
} from "lucide-react";

function OpsSidebar({ active }: { active: string }) {
  const NAV = [
    { href: "/", icon: LayoutDashboard, label: "Live Monitor" },
    { href: "/orders", icon: Package, label: "Đơn hàng" },
    { href: "/hubs", icon: MapPin, label: "Hub" },
    { href: "/reports", icon: BarChart3, label: "Báo cáo" },
  ];
  return (
    <div className="ops-sidebar">
      <div className="flex items-center gap-3 px-5 h-16" style={{ borderBottom: "1px solid rgba(251,191,36,0.08)" }}>
        <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>
          <Activity size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-white">PicBox Ops</p>
          <p className="text-[10px] text-amber-500/60 font-semibold uppercase tracking-wider">Control Center</p>
        </div>
      </div>
      <nav className="flex-1 px-2.5 py-4 space-y-1">
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = n.href === active;
          return (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all relative ${isActive ? "text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"}`}
              style={isActive ? { background: "linear-gradient(90deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)" } : undefined}
            >
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: "#fbbf24", boxShadow: "0 0 8px rgba(251,191,36,0.5)" }} />}
              <Icon size={16} className={isActive ? "text-amber-400" : ""} />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-2.5 pb-4" style={{ borderTop: "1px solid rgba(251,191,36,0.06)" }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.02] mt-4">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-[12px] font-bold text-white" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>O</div>
          <div>
            <p className="text-[12px] font-semibold text-white">Ops Manager</p>
            <p className="text-[10px] text-slate-500">ops01@picbox.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type OrderStatus = "pending" | "confirmed" | "picking" | "delivering" | "delivered" | "failed" | "cancelled";

const ORDERS = [
  { id: "PB-20260020", customer: "Trần Văn Mới", zone: "Quận 7", shipper: null, cod: 250000, status: "pending" as OrderStatus, wait: "5 phút" },
  { id: "PB-20260019", customer: "Lê Thị Oanh", zone: "Bình Thạnh", shipper: null, cod: 0, status: "pending" as OrderStatus, wait: "12 phút" },
  { id: "PB-20260018", customer: "Phạm Duy Khoa", zone: "Quận 1", shipper: "Lê Văn Tùng", cod: 0, status: "delivering" as OrderStatus, wait: "—" },
  { id: "PB-20260015", customer: "Phạm Minh Tuấn", zone: "Gò Vấp", shipper: null, cod: 180000, status: "confirmed" as OrderStatus, wait: "18 phút" },
  { id: "PB-20260010", customer: "Mai Thị Linh", zone: "Tân Bình", shipper: "Võ Thị Mai", cod: 0, status: "delivered" as OrderStatus, wait: "—" },
  { id: "PB-20260009", customer: "Ngô Quang Hùng", zone: "Quận 9", shipper: "Ngô Shipper", cod: 95000, status: "failed" as OrderStatus, wait: "—" },
];

const SHIPPERS_AVAILABLE = ["Lê Văn Tùng", "Đinh Thị Loan", "Trần Minh Khoa", "Bùi Văn An"];

const STATUS_CFG: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:    { label: "Chờ xử lý",   color: "text-slate-400",   bg: "bg-slate-500/10",  border: "border-slate-500/15" },
  confirmed:  { label: "Xác nhận",    color: "text-sky-400",     bg: "bg-sky-500/10",    border: "border-sky-500/15" },
  picking:    { label: "Đang lấy",    color: "text-amber-400",   bg: "bg-amber-500/10",  border: "border-amber-500/15" },
  delivering: { label: "Đang giao",   color: "text-blue-400",    bg: "bg-blue-500/10",   border: "border-blue-500/15" },
  delivered:  { label: "Hoàn thành",  color: "text-emerald-400", bg: "bg-emerald-500/10",border: "border-emerald-500/15" },
  failed:     { label: "Thất bại",    color: "text-rose-400",    bg: "bg-rose-500/10",   border: "border-rose-500/15" },
  cancelled:  { label: "Đã huỷ",     color: "text-rose-400",    bg: "bg-rose-500/10",   border: "border-rose-500/15" },
};

export default function OpsOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [selectedShipper, setSelectedShipper] = useState("");

  const filtered = ORDERS.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.zone.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#0c0800]">
      <OpsSidebar active="/orders" />
      <div className="ops-main p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-bold text-white">Quản lý đơn hàng</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Gán shipper và theo dõi trạng thái</p>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            {ORDERS.filter(o => o.status === "pending").length} đơn cần gán shipper
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5 stagger">
          {[
            { label: "Tổng đơn", value: ORDERS.length, icon: Package, color: "#6366f1" },
            { label: "Cần gán", value: ORDERS.filter(o=>["pending","confirmed"].includes(o.status)).length, icon: Clock, color: "#fbbf24" },
            { label: "Đang giao", value: ORDERS.filter(o=>o.status==="delivering").length, icon: Truck, color: "#38bdf8" },
            { label: "Hoàn thành", value: ORDERS.filter(o=>o.status==="delivered").length, icon: CheckCircle, color: "#34d399" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + "15" }}>
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-[24px] font-bold text-white leading-none">{s.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã đơn, khách hàng, khu vực..."
              className="w-full h-9 rounded-xl pl-9 pr-4 text-[13px] text-slate-300 placeholder-slate-600 outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,191,36,0.08)" }}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["all", "pending", "delivering", "delivered", "failed"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                  statusFilter === s
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                    : "text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
                }`}
              >
                {s === "all" ? "Tất cả" : STATUS_CFG[s as OrderStatus]?.label ?? s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
                {["Mã đơn", "Khách hàng", "Khu vực", "Shipper", "COD", "Trạng thái", "Chờ", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const sc = STATUS_CFG[o.status];
                return (
                  <tr key={o.id} className="hover:bg-white/[0.015] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td className="px-4 py-3 text-[13px] font-semibold text-white">{o.id}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-300">{o.customer}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-500">{o.zone}</td>
                    <td className="px-4 py-3 text-[12px]">
                      {o.shipper
                        ? <span className="text-slate-300">{o.shipper}</span>
                        : <span className="text-amber-500/60 italic">Chưa gán</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {o.cod > 0
                        ? <span className="text-emerald-400 font-semibold">₫{o.cod.toLocaleString()}</span>
                        : <span className="text-slate-700">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg border ${sc.color} ${sc.bg} ${sc.border}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-amber-400">{o.wait}</td>
                    <td className="px-4 py-3">
                      {!o.shipper && ["pending","confirmed"].includes(o.status) && (
                        <button
                          onClick={() => setAssignModal(o.id)}
                          className="h-7 px-3 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20 text-[11px] font-semibold hover:bg-amber-500/25 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Truck size={11} /> Gán
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setAssignModal(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-slideDown"
            style={{ background: "rgba(18,11,2,0.97)", border: "1px solid rgba(251,191,36,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[15px] font-bold text-white mb-1">Gán Shipper</h3>
            <p className="text-[12px] text-slate-500 mb-4">Đơn hàng: <span className="text-amber-400 font-semibold">{assignModal}</span></p>
            <div className="space-y-2 mb-4">
              {SHIPPERS_AVAILABLE.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedShipper(s)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[13px] transition-all cursor-pointer border flex items-center gap-3 ${
                    selectedShipper === s
                      ? "bg-amber-500/15 border-amber-500/25 text-amber-300"
                      : "bg-white/[0.03] border-white/[0.06] text-slate-400 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="h-7 w-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-[11px] font-bold text-amber-400 flex-shrink-0">
                    {s.charAt(0)}
                  </div>
                  {s}
                  {selectedShipper === s && <CheckCircle size={14} className="ml-auto text-amber-400" />}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAssignModal(null)} className="flex-1 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-slate-400 hover:bg-white/[0.06] transition-all cursor-pointer">
                Hủy
              </button>
              <button
                disabled={!selectedShipper}
                onClick={() => { setAssignModal(null); setSelectedShipper(""); }}
                className="flex-1 h-10 rounded-xl text-white text-[13px] font-semibold disabled:opacity-40 cursor-pointer transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
              >
                Xác nhận gán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
