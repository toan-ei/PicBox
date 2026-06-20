"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package, Truck, DollarSign, Star, MapPin, Bell,
  ChevronRight, Clock, CheckCircle, AlertCircle, Home, List, Wallet, User,
  Navigation, Phone, TrendingUp,
} from "lucide-react";

/* ── Bottom nav ── */
const NAV = [
  { href: "/", icon: Home, label: "Trang chủ" },
  { href: "/orders", icon: List, label: "Đơn hàng" },
  { href: "/earnings", icon: Wallet, label: "Thu nhập" },
  { href: "/profile", icon: User, label: "Tài khoản" },
];

function BottomNav({ active }: { active: string }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2"
      style={{
        background: "rgba(4,12,28,0.97)",
        borderTop: "1px solid rgba(56,189,248,0.10)",
        backdropFilter: "blur(20px)",
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
        paddingTop: "0.5rem",
      }}
    >
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${isActive ? "" : "opacity-50"}`}
          >
            <div className={`relative ${isActive ? "" : ""}`}>
              <Icon size={20} className={isActive ? "text-cyan-400" : "text-slate-500"} />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cyan-400"
                  style={{ boxShadow: "0 0 6px rgba(56,189,248,0.8)" }} />
              )}
            </div>
            <span className={`text-[10px] font-semibold ${isActive ? "text-cyan-400" : "text-slate-600"}`}>{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

/* ── Mock data ── */
const ACTIVE_ORDER = {
  id: "PB-20260003",
  customer: "Lê Văn C",
  phone: "0923456789",
  from: "95 Trần Hưng Đạo, Quận 3",
  to: "45 Nguyễn Văn Linh, Thủ Đức",
  cod: 180000,
  fee: 42000,
  weight: 2.1,
  note: "Gọi trước khi giao. Để ở bảo vệ nếu vắng.",
  status: "picking" as const,
  eta: "~15 phút",
};

const STATS = [
  { label: "Hôm nay", value: "12", unit: "đơn", icon: Package, color: "#38bdf8", bg: "rgba(56,189,248,0.10)" },
  { label: "Thu nhập", value: "₫485k", unit: "hôm nay", icon: DollarSign, color: "#34d399", bg: "rgba(52,211,153,0.10)" },
  { label: "Rating", value: "4.8", unit: "/ 5.0", icon: Star, color: "#fbbf24", bg: "rgba(251,191,36,0.10)" },
  { label: "Tổng tháng", value: "₫8.5M", unit: "tháng 5", icon: TrendingUp, color: "#a78bfa", bg: "rgba(167,139,250,0.10)" },
];

const RECENT_ORDERS = [
  { id: "PB-20260001", customer: "Nguyễn Văn A", to: "Quận 7", amount: "₫125k", time: "8:12", status: "delivered" },
  { id: "PB-20260002", customer: "Trần Thị B", to: "Gò Vấp", amount: "₫89k", time: "9:05", status: "failed" },
  { id: "PB-20260004", customer: "Phạm Thị D", to: "Bình Thạnh", amount: "₫210k", time: "10:30", status: "delivered" },
];

export default function ShipperDashboard() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="min-h-screen bg-[#020c18]">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <div>
            <p className="text-[12px] text-slate-500">Xin chào,</p>
            <h1 className="text-[20px] font-bold text-white">Ngô Văn Tùng 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative h-10 w-10 rounded-xl glass flex items-center justify-center press-effect cursor-pointer">
              <Bell size={16} className="text-slate-400" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 animate-pulse-dot" />
            </button>
            {/* Online toggle */}
            <button
              onClick={() => setIsOnline((v) => !v)}
              className={`flex items-center gap-2 px-3.5 h-10 rounded-xl border text-[12px] font-semibold transition-all duration-300 cursor-pointer press-effect ${
                isOnline
                  ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
                  : "bg-slate-500/10 border-slate-500/15 text-slate-500"
              }`}
            >
              <span className={`h-2 w-2 rounded-full transition-all duration-300 ${isOnline ? "bg-emerald-400 animate-pulse-dot" : "bg-slate-600"}`} />
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>
        </div>

        {/* Active delivery card */}
        {ACTIVE_ORDER && (
          <Link href={`/delivery/${ACTIVE_ORDER.id}`}>
            <div
              className="rounded-2xl p-5 mb-5 cursor-pointer hover:scale-[1.01] transition-all duration-300 animate-slideUp press-effect"
              style={{
                background: "linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(6,182,212,0.12) 100%)",
                border: "1px solid rgba(56,189,248,0.25)",
                boxShadow: "0 8px 32px -8px rgba(14,165,233,0.3)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-cyan-500/20 flex items-center justify-center animate-float">
                    <Truck size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-cyan-300/70 uppercase tracking-wider font-semibold">Đơn đang giao</p>
                    <p className="text-[14px] font-bold text-white">{ACTIVE_ORDER.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/25 px-2.5 py-1 rounded-lg font-semibold">
                    Đang lấy hàng
                  </span>
                  <span className="text-[10px] text-slate-500">ETA {ACTIVE_ORDER.eta}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold text-emerald-400">A</span>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-300">{ACTIVE_ORDER.from}</p>
                    <p className="text-[10px] text-slate-600">Điểm lấy hàng</p>
                  </div>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <div className="w-px h-4 bg-slate-700" />
                  <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 via-cyan-500/20 to-transparent" />
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold text-cyan-400">B</span>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-300">{ACTIVE_ORDER.to}</p>
                    <p className="text-[10px] text-slate-600">Điểm giao hàng</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(56,189,248,0.10)" }}>
                <div className="flex items-center gap-4">
                  {ACTIVE_ORDER.cod > 0 && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={12} className="text-emerald-400" />
                      <span className="text-[12px] font-semibold text-emerald-400">COD ₫{ACTIVE_ORDER.cod.toLocaleString()}</span>
                    </div>
                  )}
                  <span className="text-[12px] text-slate-500">Cước ₫{ACTIVE_ORDER.fee.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-400">
                  <span className="text-[12px] font-semibold">Chi tiết</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5 stagger">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-card p-4 animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                    <Icon size={15} style={{ color: s.color }} />
                  </div>
                  <span className="text-[10px] text-slate-600">{s.unit}</span>
                </div>
                <p className="text-[22px] font-bold text-white leading-none">{s.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Recent orders */}
        <div className="glass-card p-4 mb-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-white">Đơn gần đây</h3>
            <Link href="/orders" className="text-[11px] text-cyan-400 flex items-center gap-0.5 press-effect">
              Tất cả <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_ORDERS.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer press-effect">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${o.status === "delivered" ? "bg-emerald-500/15" : "bg-rose-500/15"}`}>
                    {o.status === "delivered"
                      ? <CheckCircle size={15} className="text-emerald-400" />
                      : <AlertCircle size={15} className="text-rose-400" />
                    }
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white">{o.customer}</p>
                    <p className="text-[10px] text-slate-600">{o.to} · {o.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[13px] font-semibold ${o.status === "delivered" ? "text-emerald-400" : "text-slate-600 line-through"}`}>
                    {o.amount}
                  </p>
                  <p className={`text-[9px] font-semibold ${o.status === "delivered" ? "text-emerald-500/60" : "text-rose-500/60"}`}>
                    {o.status === "delivered" ? "Thành công" : "Thất bại"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Area info */}
        <div className="glass-card p-4 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <MapPin size={14} className="text-cyan-400" />
            </div>
            <div>
              <span className="text-[13px] font-semibold text-white">Khu vực hoạt động</span>
              <p className="text-[11px] text-slate-500">Bình Thạnh, TP.HCM</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Package size={13} className="text-cyan-400" />
              <span className="text-[12px] text-slate-400">3 đơn đang chờ gần bạn</span>
            </div>
            <button className="flex items-center gap-1 text-cyan-400 text-[12px] font-semibold cursor-pointer press-effect">
              <Navigation size={12} />
              Bản đồ
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="/" />
    </div>
  );
}
