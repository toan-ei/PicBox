"use client";

import React from "react";
import Link from "next/link";
import {
  Truck, Package, MapPin, Clock, CheckCircle, ChevronRight,
  Navigation, Home, Map, ArrowLeftRight, User, Calendar,
} from "lucide-react";

function BottomNav({ active }: { active: string }) {
  const NAV = [
    { href: "/", icon: Home, label: "Tổng quan" },
    { href: "/routes", icon: Map, label: "Lộ trình" },
    { href: "/trips", icon: ArrowLeftRight, label: "Chuyến hàng" },
    { href: "/profile", icon: User, label: "Tài khoản" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{ background: "rgba(2,9,5,0.97)", borderTop: "1px solid rgba(52,211,153,0.10)", backdropFilter: "blur(20px)" }}>
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

const TODAY_TRIP = {
  id: "TRIP-0514-01",
  from: { hub: "Hub Trung Tâm HCM", address: "Quận 1, TP.HCM" },
  to:   { hub: "Hub Gò Vấp", address: "Gò Vấp, TP.HCM" },
  parcels: 48,
  weight: 120,
  departAt: "08:00",
  status: "in-progress" as const,
  progress: 65,
};

const STATS = [
  { label: "Chuyến hôm nay", value: "2", icon: Truck, color: "#34d399" },
  { label: "Kiện hàng", value: "86", icon: Package, color: "#6ee7b7" },
  { label: "Tổng tuần", value: "8", icon: Calendar, color: "#a7f3d0" },
  { label: "Đúng giờ", value: "97%", icon: Clock, color: "#d1fae5" },
];

const RECENT_TRIPS = [
  { id: "TRIP-0514-00", from: "Hub Q1", to: "Hub Bình Dương", parcels: 38, status: "done", time: "07:00" },
  { id: "TRIP-0513-01", from: "Hub GV", to: "Hub Q1", parcels: 52, status: "done", time: "Hôm qua" },
];

export default function DriverDashboard() {
  return (
    <div className="min-h-screen bg-[#020f0a]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #34d399 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[12px] text-slate-500">Xin chào,</p>
            <h1 className="text-[20px] font-bold text-white">Đặng Văn Driver 🚚</h1>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-600">Thứ 4, 14/05/2026</p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">● Đang hoạt động</p>
          </div>
        </div>

        {/* Active trip card */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(52,211,153,0.10) 100%)",
            border: "1px solid rgba(52,211,153,0.25)",
            boxShadow: "0 8px 32px -8px rgba(16,185,129,0.3)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Truck size={15} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-emerald-300/70 uppercase tracking-wider font-semibold">Chuyến đang chạy</p>
                <p className="text-[13px] font-bold text-white">{TODAY_TRIP.id}</p>
              </div>
            </div>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 px-2 py-1 rounded-lg font-semibold">
              Đang di chuyển
            </span>
          </div>

          {/* Route */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] font-bold text-emerald-400">A</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">{TODAY_TRIP.from.hub}</p>
                <p className="text-[11px] text-slate-500">{TODAY_TRIP.from.address}</p>
              </div>
            </div>
            <div className="ml-2.5 h-5 flex items-center gap-2">
              <div className="w-px h-full bg-slate-700" />
              <span className="text-[10px] text-slate-600">~35 phút</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] font-bold text-sky-400">B</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">{TODAY_TRIP.to.hub}</p>
                <p className="text-[11px] text-slate-500">{TODAY_TRIP.to.address}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between mb-1.5">
              <span className="text-[11px] text-emerald-300/70">Tiến trình</span>
              <span className="text-[11px] font-semibold text-emerald-400">{TODAY_TRIP.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${TODAY_TRIP.progress}%`,
                  background: "linear-gradient(90deg, #10b981, #34d399)",
                  boxShadow: "0 0 8px rgba(52,211,153,0.5)",
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[12px] text-slate-400">{TODAY_TRIP.parcels} kiện · {TODAY_TRIP.weight} kg</span>
            <Link href={`/trips/${TODAY_TRIP.id}`} className="flex items-center gap-1 text-emerald-400 text-[12px] font-semibold">
              Chi tiết <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5 stagger">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-card p-4 animate-fadeIn">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={13} style={{ color: s.color }} />
                  <span className="text-[11px] text-slate-500">{s.label}</span>
                </div>
                <p className="text-[22px] font-bold text-white">{s.value}</p>
              </div>
            );
          })}
        </div>

        {/* Check-in section */}
        <div className="glass-card p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-emerald-400" />
            <h3 className="text-[13px] font-semibold text-white">Check-in Hub</h3>
          </div>
          <p className="text-[12px] text-slate-500 mb-3">Bạn đang ở gần Hub Gò Vấp. Xác nhận check-in để bắt đầu bốc dỡ hàng.</p>
          <button
            className="w-full h-11 rounded-2xl text-white text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #10b981, #34d399)", boxShadow: "0 4px 16px -4px rgba(16,185,129,0.5)" }}
          >
            <CheckCircle size={16} /> Check-in Hub Gò Vấp
          </button>
        </div>

        {/* Recent trips */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-white">Chuyến gần đây</h3>
            <Link href="/trips" className="text-[11px] text-emerald-400 flex items-center gap-0.5">
              Tất cả <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_TRIPS.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/[0.10] flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={13} className="text-emerald-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-[12px] font-medium text-white">
                    <span>{t.from}</span>
                    <ChevronRight size={10} className="text-slate-600" />
                    <span>{t.to}</span>
                  </div>
                  <p className="text-[10px] text-slate-600">{t.parcels} kiện · {t.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="/" />
    </div>
  );
}
