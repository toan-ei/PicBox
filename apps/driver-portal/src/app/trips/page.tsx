"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck, Package, Clock, CheckCircle, ChevronRight, Search,
  ArrowLeftRight, Home, Map, User, AlertTriangle, Calendar, Filter,
} from "lucide-react";

function BottomNav({ active }: { active: string }) {
  const NAV = [
    { href: "/", icon: Home, label: "Tổng quan" },
    { href: "/routes", icon: Map, label: "Lộ trình" },
    { href: "/trips", icon: ArrowLeftRight, label: "Chuyến hàng" },
    { href: "/profile", icon: User, label: "Tài khoản" },
  ];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{ background: "rgba(2,9,5,0.97)", borderTop: "1px solid rgba(52,211,153,0.10)", backdropFilter: "blur(20px)" }}
    >
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${isActive ? "" : "opacity-50"}`}>
            <Icon size={20} className={isActive ? "text-emerald-400" : "text-slate-500"} />
            <span className={`text-[10px] font-semibold ${isActive ? "text-emerald-400" : "text-slate-600"}`}>{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

type TripStatus = "done" | "in-progress" | "pending" | "cancelled";

interface Trip {
  id: string;
  from: string;
  to: string;
  parcels: number;
  weight: number;
  depart: string;
  arrive: string;
  status: TripStatus;
  date: string;
  vehicle: string;
}

const ALL_TRIPS: Trip[] = [
  { id: "TRIP-0514-02", from: "Hub Gò Vấp", to: "Hub Q1", parcels: 52, weight: 130, depart: "14:00", arrive: "15:30", status: "pending", date: "14/05/2026", vehicle: "51B-12345" },
  { id: "TRIP-0514-01", from: "Hub Q1", to: "Hub Gò Vấp", parcels: 48, weight: 120, depart: "10:00", arrive: "11:30", status: "in-progress", date: "14/05/2026", vehicle: "51B-12345" },
  { id: "TRIP-0514-00", from: "Hub Q1", to: "Hub Bình Dương", parcels: 38, weight: 95, depart: "07:00", arrive: "08:30", status: "done", date: "14/05/2026", vehicle: "51B-12345" },
  { id: "TRIP-0513-01", from: "Hub GV", to: "Hub Q1", parcels: 52, weight: 130, depart: "13:00", arrive: "14:20", status: "done", date: "13/05/2026", vehicle: "51B-12345" },
  { id: "TRIP-0513-00", from: "Hub BD", to: "Hub Q1", parcels: 44, weight: 110, depart: "08:00", arrive: "09:30", status: "done", date: "13/05/2026", vehicle: "51B-12345" },
  { id: "TRIP-0512-01", from: "Hub Q1", to: "CN Long An", parcels: 60, weight: 155, depart: "09:00", arrive: "11:00", status: "done", date: "12/05/2026", vehicle: "51B-12345" },
  { id: "TRIP-0512-00", from: "CN Long An", to: "Hub Q1", parcels: 35, weight: 88, depart: "14:00", arrive: "16:00", status: "done", date: "12/05/2026", vehicle: "51B-12345" },
  { id: "TRIP-0511-00", from: "Hub Q1", to: "Hub GV", parcels: 42, weight: 105, depart: "08:00", arrive: "09:15", status: "cancelled", date: "11/05/2026", vehicle: "51B-12345" },
];

const STATUS_CONFIG: Record<TripStatus, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  done:          { label: "Hoàn thành",    icon: CheckCircle,     color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20" },
  "in-progress": { label: "Đang chạy",    icon: Truck,           color: "text-sky-400",     bg: "bg-sky-500/15",     border: "border-sky-500/20" },
  pending:       { label: "Chưa bắt đầu", icon: Clock,           color: "text-slate-400",   bg: "bg-slate-500/15",   border: "border-slate-500/20" },
  cancelled:     { label: "Đã huỷ",       icon: AlertTriangle,   color: "text-rose-400",    bg: "bg-rose-500/15",    border: "border-rose-500/20" },
};

const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "today", label: "Hôm nay" },
  { key: "week", label: "Tuần này" },
  { key: "done", label: "Hoàn thành" },
];

export default function TripsListPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = ALL_TRIPS.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = t.id.toLowerCase().includes(q) || t.from.toLowerCase().includes(q) || t.to.toLowerCase().includes(q);

    const matchTab =
      tab === "all" ? true :
      tab === "today" ? t.date === "14/05/2026" :
      tab === "week" ? ["14/05/2026", "13/05/2026", "12/05/2026", "11/05/2026"].includes(t.date) :
      t.status === "done";

    return matchSearch && matchTab;
  });

  const totalParcels = ALL_TRIPS.reduce((sum, t) => sum + t.parcels, 0);
  const totalWeight = ALL_TRIPS.reduce((sum, t) => sum + t.weight, 0);
  const doneCount = ALL_TRIPS.filter((t) => t.status === "done").length;

  return (
    <div className="min-h-screen bg-[#020f0a]">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="mb-5 animate-fadeIn">
          <h1 className="text-[20px] font-bold text-white">Chuyến hàng</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Lịch sử và chuyến sắp tới</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-5 stagger">
          {[
            { label: "Tổng chuyến", value: String(ALL_TRIPS.length), icon: ArrowLeftRight, color: "#34d399" },
            { label: "Hoàn thành", value: `${doneCount}/${ALL_TRIPS.length}`, icon: CheckCircle, color: "#6ee7b7" },
            { label: "Tổng kiện", value: String(totalParcels), icon: Package, color: "#a7f3d0" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-card p-3 text-center animate-fadeIn">
                <Icon size={16} className="mx-auto mb-1.5" style={{ color: s.color }} />
                <p className="text-[14px] font-bold text-white">{s.value}</p>
                <p className="text-[9px] text-slate-600 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-4 animate-fadeIn">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã chuyến, hub..."
            className="w-full h-10 rounded-2xl pl-10 pr-4 text-[13px] text-slate-300 placeholder-slate-600 outline-none transition-all"
            style={{ background: "rgba(5,18,12,0.8)", border: "1px solid rgba(52,211,153,0.10)" }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 p-1 rounded-2xl" style={{ background: "rgba(5,18,12,0.7)", border: "1px solid rgba(52,211,153,0.08)" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                tab === t.key
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Trip list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              <ArrowLeftRight size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-[13px]">Không tìm thấy chuyến nào</p>
            </div>
          )}
          {filtered.map((trip) => {
            const sc = STATUS_CONFIG[trip.status];
            const Icon = sc.icon;
            return (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <div
                  className="rounded-2xl p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200 mb-1"
                  style={{ background: "rgba(5,18,12,0.8)", border: "1px solid rgba(52,211,153,0.08)" }}
                >
                  {/* Top */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-white mb-0.5">
                        <span>{trip.from}</span>
                        <ChevronRight size={12} className="text-slate-600" />
                        <span>{trip.to}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{trip.id}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-xl border ${sc.color} ${sc.bg} ${sc.border}`}>
                      <Icon size={10} /> {sc.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 mb-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={10} /> {trip.depart} → {trip.arrive}</span>
                    <span className="flex items-center gap-1"><Package size={10} /> {trip.parcels} kiện</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> {trip.date}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between" style={{ borderTop: "1px solid rgba(52,211,153,0.06)", paddingTop: "0.75rem" }}>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1"><Truck size={10} /> {trip.vehicle}</span>
                      <span>{trip.weight} kg</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-600" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <BottomNav active="/trips" />
    </div>
  );
}
