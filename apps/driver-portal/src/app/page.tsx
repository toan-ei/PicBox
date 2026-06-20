"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck, Package, MapPin, Clock, CheckCircle, ChevronRight,
  Navigation, Home, Map, ArrowLeftRight, User, Calendar,
  AlertTriangle, Phone, Shield,
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
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2"
      style={{
        background: "rgba(2,9,5,0.97)",
        borderTop: "1px solid rgba(52,211,153,0.10)",
        backdropFilter: "blur(20px)",
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
        paddingTop: "0.5rem",
      }}
    >
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${isActive ? "" : "opacity-50"}`}>
            <div className="relative">
              <Icon size={20} className={isActive ? "text-emerald-400" : "text-slate-500"} />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-emerald-400"
                  style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
              )}
            </div>
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
  arriveAt: "~11:30",
  status: "in-progress" as const,
  progress: 65,
  vehicle: "51B-12345",
};

const STATS = [
  { label: "Chuyến hôm nay", value: "2", icon: Truck, color: "#34d399", bg: "rgba(52,211,153,0.10)" },
  { label: "Kiện hàng", value: "86", icon: Package, color: "#6ee7b7", bg: "rgba(110,231,183,0.10)" },
  { label: "Tổng tuần", value: "8", icon: Calendar, color: "#a7f3d0", bg: "rgba(167,243,208,0.10)" },
  { label: "Đúng giờ", value: "97%", icon: Clock, color: "#d1fae5", bg: "rgba(209,250,229,0.10)" },
];

const RECENT_TRIPS = [
  { id: "TRIP-0514-00", from: "Hub Q1", to: "Hub Bình Dương", parcels: 38, status: "done", time: "07:00", weight: 95 },
  { id: "TRIP-0513-01", from: "Hub GV", to: "Hub Q1", parcels: 52, status: "done", time: "Hôm qua", weight: 130 },
];

export default function DriverDashboard() {
  const [checkingIn, setCheckingIn] = useState(false);

  return (
    <div className="min-h-screen bg-[#020f0a]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #34d399 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <div>
            <p className="text-[12px] text-slate-500">Xin chào,</p>
            <h1 className="text-[20px] font-bold text-white">Đặng Văn Driver 🚚</h1>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-600" suppressHydrationWarning>
              {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" })}
            </p>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-dot" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }} />
              <p className="text-[11px] text-emerald-400 font-semibold">Đang hoạt động</p>
            </div>
          </div>
        </div>

        {/* Active trip card */}
        <Link href={`/trips/${TODAY_TRIP.id}`}>
          <div
            className="rounded-2xl p-5 mb-5 cursor-pointer hover:scale-[1.01] transition-all duration-300 animate-slideUp press-effect"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(52,211,153,0.10) 100%)",
              border: "1px solid rgba(52,211,153,0.25)",
              boxShadow: "0 8px 32px -8px rgba(16,185,129,0.3)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 flex items-center justify-center animate-float">
                  <Truck size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-300/70 uppercase tracking-wider font-semibold">Chuyến đang chạy</p>
                  <p className="text-[14px] font-bold text-white">{TODAY_TRIP.id}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 px-2.5 py-1 rounded-lg font-semibold">
                  Đang di chuyển
                </span>
                <span className="text-[10px] text-slate-500">{TODAY_TRIP.vehicle}</span>
              </div>
            </div>

            {/* Route */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-bold text-emerald-400">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white truncate">{TODAY_TRIP.from.hub}</p>
                  <p className="text-[10px] text-slate-500">{TODAY_TRIP.from.address} · {TODAY_TRIP.departAt}</p>
                </div>
              </div>
              <div className="ml-3 flex items-center gap-2">
                <div className="w-px h-5 bg-slate-700" />
                <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 via-sky-500/20 to-transparent" />
                <span className="text-[9px] text-slate-600">ETA {TODAY_TRIP.arriveAt}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-bold text-sky-400">B</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white truncate">{TODAY_TRIP.to.hub}</p>
                  <p className="text-[10px] text-slate-500">{TODAY_TRIP.to.address}</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] text-emerald-300/70">Tiến trình</span>
                <span className="text-[11px] font-bold text-emerald-400">{TODAY_TRIP.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full transition-all duration-700 animate-progress-glow"
                  style={{
                    width: `${TODAY_TRIP.progress}%`,
                    background: "linear-gradient(90deg, #10b981, #34d399)",
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(52,211,153,0.10)" }}>
              <span className="text-[12px] text-slate-400">{TODAY_TRIP.parcels} kiện · {TODAY_TRIP.weight} kg</span>
              <div className="flex items-center gap-1 text-emerald-400 text-[12px] font-semibold">
                Chi tiết <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5 stagger">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-card p-4 animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                    <Icon size={14} style={{ color: s.color }} />
                  </div>
                </div>
                <p className="text-[22px] font-bold text-white leading-none">{s.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Check-in section */}
        <div className="glass-card p-4 mb-4 animate-fadeIn">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <MapPin size={15} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-white">Check-in Hub</h3>
              <p className="text-[10px] text-slate-500">Bạn đang ở gần Hub Gò Vấp</p>
            </div>
          </div>
          <p className="text-[12px] text-slate-500 mb-3">Xác nhận check-in để bắt đầu bốc dỡ hàng tại hub.</p>
          <button
            onClick={() => {
              setCheckingIn(true);
              setTimeout(() => setCheckingIn(false), 2000);
            }}
            disabled={checkingIn}
            className="w-full h-12 rounded-2xl text-white text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #10b981, #34d399)", boxShadow: "0 4px 16px -4px rgba(16,185,129,0.5)" }}
          >
            {checkingIn ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xác nhận...
              </>
            ) : (
              <>
                <CheckCircle size={16} /> Check-in Hub Gò Vấp
              </>
            )}
          </button>
        </div>

        {/* SOS Button */}
        <div className="glass-card p-4 mb-4 animate-fadeIn" style={{ border: "1px solid rgba(239,68,68,0.10)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <AlertTriangle size={15} className="text-rose-400" />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-white">Báo sự cố</h3>
                <p className="text-[10px] text-slate-500">Xe hỏng, tai nạn, mất hàng...</p>
              </div>
            </div>
            <button className="h-10 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] font-semibold cursor-pointer press-effect flex items-center gap-1.5">
              <Phone size={12} /> SOS
            </button>
          </div>
        </div>

        {/* Recent trips */}
        <div className="glass-card p-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-white">Chuyến gần đây</h3>
            <Link href="/trips" className="text-[11px] text-emerald-400 flex items-center gap-0.5 press-effect">
              Tất cả <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_TRIPS.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer press-effect">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/[0.10] flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={14} className="text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-[12px] font-medium text-white">
                    <span className="truncate">{t.from}</span>
                    <ChevronRight size={10} className="text-slate-600 flex-shrink-0" />
                    <span className="truncate">{t.to}</span>
                  </div>
                  <p className="text-[10px] text-slate-600">{t.parcels} kiện · {t.weight}kg · {t.time}</p>
                </div>
                <ChevronRight size={14} className="text-slate-700 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="/" />
    </div>
  );
}
