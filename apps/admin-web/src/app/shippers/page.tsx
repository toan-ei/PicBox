"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout";
import { Badge } from "@/components/ui";
import { Search, Star, Phone, MapPin, Package, TrendingUp, Truck, UserCheck } from "lucide-react";

type ShipperStatus = "online" | "delivering" | "offline" | "suspended";

interface Shipper {
  id: string;
  name: string;
  phone: string;
  zone: string;
  vehicle: string;
  status: ShipperStatus;
  rating: number;
  completedToday: number;
  completedTotal: number;
  earningsMonth: number;
  joinDate: string;
}

const SHIPPERS: Shipper[] = [
  { id: "SH001", name: "Lê Văn Shipper", phone: "0901000001", zone: "Quận 1-3, HCM", vehicle: "Xe máy", status: "delivering", rating: 4.8, completedToday: 12, completedTotal: 1240, earningsMonth: 8500000, joinDate: "01/01/2026" },
  { id: "SH002", name: "Võ Thị Mai", phone: "0901000002", zone: "Quận 7-8, HCM", vehicle: "Xe máy", status: "online", rating: 4.6, completedToday: 8, completedTotal: 980, earningsMonth: 6200000, joinDate: "15/01/2026" },
  { id: "SH003", name: "Ngô Văn Tùng", phone: "0901000003", zone: "Bình Thạnh, HCM", vehicle: "Xe đạp điện", status: "online", rating: 4.9, completedToday: 15, completedTotal: 2100, earningsMonth: 9800000, joinDate: "10/11/2025" },
  { id: "SH004", name: "Trần Minh Khoa", phone: "0901000004", zone: "Tân Bình, HCM", vehicle: "Xe máy", status: "offline", rating: 4.3, completedToday: 0, completedTotal: 560, earningsMonth: 3200000, joinDate: "01/03/2026" },
  { id: "SH005", name: "Đinh Thị Loan", phone: "0901000005", zone: "Quận 12, HCM", vehicle: "Xe máy", status: "delivering", rating: 4.7, completedToday: 10, completedTotal: 890, earningsMonth: 7100000, joinDate: "20/02/2026" },
  { id: "SH006", name: "Phạm Hùng Dũng", phone: "0901000006", zone: "Gò Vấp, HCM", vehicle: "Xe tải nhỏ", status: "suspended", rating: 3.2, completedToday: 0, completedTotal: 320, earningsMonth: 0, joinDate: "01/04/2026" },
];

const STATUS_CONFIG: Record<ShipperStatus, { label: string; color: string; dot: string }> = {
  online:    { label: "Sẵn sàng",   color: "text-emerald-400", dot: "bg-emerald-400" },
  delivering:{ label: "Đang giao",  color: "text-sky-400",     dot: "bg-sky-400" },
  offline:   { label: "Offline",    color: "text-slate-500",   dot: "bg-slate-600" },
  suspended: { label: "Bị khoá",   color: "text-rose-400",    dot: "bg-rose-400" },
};

const SUMMARY = [
  { label: "Tổng shipper", value: SHIPPERS.length.toString(), icon: UserCheck, color: "text-indigo-400", bg: "bg-indigo-500/[0.08]" },
  { label: "Đang hoạt động", value: "3", icon: Truck, color: "text-emerald-400", bg: "bg-emerald-500/[0.08]" },
  { label: "Đơn hôm nay", value: "45", icon: Package, color: "text-sky-400", bg: "bg-sky-500/[0.08]" },
  { label: "Hiệu suất TB", value: "4.6★", icon: Star, color: "text-amber-400", bg: "bg-amber-500/[0.08]" },
];

export default function ShippersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Shipper | null>(null);

  const filtered = SHIPPERS.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.phone.includes(q) || s.zone.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-[18px] font-bold text-white">Quản lý Shipper</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Theo dõi hoạt động và hiệu suất shipper trong hệ thống</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 stagger">
          {SUMMARY.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
                <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className={s.color} />
                </div>
                <div>
                  <p className="text-[20px] font-bold text-white leading-none">{s.value}</p>
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
              placeholder="Tìm tên, SĐT, khu vực..."
              className="w-full h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] pl-9 pr-4 text-[13px] text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/40"
            />
          </div>
          <div className="flex gap-1.5">
            {[
              { key: "all", label: "Tất cả" },
              { key: "online", label: "Sẵn sàng" },
              { key: "delivering", label: "Đang giao" },
              { key: "offline", label: "Offline" },
              { key: "suspended", label: "Bị khoá" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                  statusFilter === f.key
                    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                    : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid + Detail */}
        <div className="flex gap-4">
          {/* Card grid */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((shipper) => {
                const sc = STATUS_CONFIG[shipper.status];
                return (
                  <div
                    key={shipper.id}
                    onClick={() => setSelected(shipper)}
                    className={`glass rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-indigo-500/20 ${selected?.id === shipper.id ? "border-indigo-500/30 bg-indigo-500/[0.03]" : ""}`}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-[14px] font-bold text-white border border-white/[0.08]">
                            {shipper.name.charAt(0)}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#070d1f] ${sc.dot}`} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-white leading-tight">{shipper.name}</p>
                          <p className="text-[11px] text-slate-500">{shipper.id}</p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold ${sc.color}`}>{sc.label}</span>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <Phone size={11} className="flex-shrink-0" />
                        {shipper.phone}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <MapPin size={11} className="flex-shrink-0" />
                        {shipper.zone}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center rounded-xl bg-white/[0.03] border border-white/[0.05] py-2">
                        <p className="text-[15px] font-bold text-white">{shipper.completedToday}</p>
                        <p className="text-[9px] text-slate-600 uppercase tracking-wide">Hôm nay</p>
                      </div>
                      <div className="text-center rounded-xl bg-white/[0.03] border border-white/[0.05] py-2">
                        <p className="text-[15px] font-bold text-white">{shipper.rating}</p>
                        <p className="text-[9px] text-slate-600 uppercase tracking-wide">Rating</p>
                      </div>
                      <div className="text-center rounded-xl bg-white/[0.03] border border-white/[0.05] py-2">
                        <p className="text-[15px] font-bold text-white">{(shipper.completedTotal / 1000).toFixed(1)}k</p>
                        <p className="text-[9px] text-slate-600 uppercase tracking-wide">Tổng đơn</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-72 flex-shrink-0 glass rounded-xl p-5 animate-slideDown">
              <div className="text-center mb-5">
                <div className="relative inline-block">
                  <div className="h-16 w-16 rounded-2xl gradient-brand flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
                    {selected.name.charAt(0)}
                  </div>
                  <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#070d1f] ${STATUS_CONFIG[selected.status].dot}`} />
                </div>
                <p className="mt-3 text-[14px] font-bold text-white">{selected.name}</p>
                <p className="text-[11px] text-slate-500">{selected.id} · {selected.vehicle}</p>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { label: "Điện thoại", value: selected.phone },
                  { label: "Khu vực", value: selected.zone },
                  { label: "Thu nhập tháng", value: `₫${selected.earningsMonth.toLocaleString()}` },
                  { label: "Ngày gia nhập", value: selected.joinDate },
                  { label: "Tổng đơn", value: `${selected.completedTotal} đơn` },
                  { label: "Rating TB", value: `⭐ ${selected.rating}/5` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-600">{row.label}</span>
                    <span className="text-[12px] text-slate-300">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
                {selected.status !== "suspended" ? (
                  <button className="w-full h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/15 text-[12px] font-medium hover:bg-rose-500/15 transition-all cursor-pointer">
                    Tạm khoá tài khoản
                  </button>
                ) : (
                  <button className="w-full h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 text-[12px] font-medium hover:bg-emerald-500/15 transition-all cursor-pointer">
                    Mở khoá tài khoản
                  </button>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="w-full h-9 rounded-xl bg-white/[0.03] text-slate-500 border border-white/[0.06] text-[12px] font-medium hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
