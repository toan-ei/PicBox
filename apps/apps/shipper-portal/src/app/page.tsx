"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package, Truck, DollarSign, Star, MapPin, Bell,
  ChevronRight, Clock, CheckCircle, AlertCircle, Home, List, Wallet, User,
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
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{ background: "rgba(4,12,28,0.97)", borderTop: "1px solid rgba(56,189,248,0.10)", backdropFilter: "blur(20px)" }}
    >
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${isActive ? "" : "opacity-50"}`}
          >
            <Icon size={20} className={isActive ? "text-cyan-400" : "text-slate-500"} />
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
};

const STATS = [
  { label: "Hôm nay", value: "12", unit: "đơn", icon: Package, color: "#38bdf8" },
  { label: "Thu nhập", value: "₫485k", unit: "hôm nay", icon: DollarSign, color: "#34d399" },
  { label: "Rating", value: "4.8", unit: "/ 5.0", icon: Star, color: "#fbbf24" },
  { label: "Tổng tháng", value: "₫8.5M", unit: "tháng 5", icon: Wallet, color: "#a78bfa" },
];

const RECENT_ORDERS = [
  { id: "PB-20260001", customer: "Nguyễn Văn A", to: "Quận 7", amount: "₫125k", time: "8:12", status: "delivered" },
  { id: "PB-20260002", customer: "Trần Thị B", to: "Gò Vấp", amount: "₫89k", time: "9:05", status: "failed" },
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[12px] text-slate-500">Xin chào,</p>
            <h1 className="text-[20px] font-bold text-white">Ngô Văn Tùng 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative h-9 w-9 rounded-xl glass flex items-center justify-center">
              <Bell size={16} className="text-slate-400" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>
            {/* Online toggle */}
            <button
              onClick={() => setIsOnline((v) => !v)}
              className={`flex items-center gap-2 px-3 h-9 rounded-xl border text-[12px] font-semibold transition-all cursor-pointer ${
                isOnline
                  ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
                  : "bg-slate-500/10 border-slate-500/15 text-slate-500"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>
        </div>

        {/* Active delivery card */}
        {ACTIVE_ORDER && (
          <Link href={`/delivery/${ACTIVE_ORDER.id}`}>
            <div
              className="rounded-2xl p-5 mb-5 cursor-pointer hover:scale-[1.01] transition-transform"
              style={{
                background: "linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(6,182,212,0.12) 100%)",
                border: "1px solid rgba(56,189,248,0.25)",
                boxShadow: "0 8px 32px -8px rgba(14,165,233,0.3)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Truck size={15} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-cyan-300/70 uppercase tracking-wider font-semibold">Đơn đang giao</p>
                    <p className="text-[13px] font-bold text-white">{ACTIVE_ORDER.id}</p>
                  </div>
                </div>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/25 px-2 py-1 rounded-lg font-semibold">Đang lấy hàng</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold text-emerald-400">A</span>
                  </div>
                  <p className="text-[12px] text-slate-300">{ACTIVE_ORDER.from}</p>
                </div>
                <div className="ml-2.5 h-4 w-px bg-slate-700" />
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold text-cyan-400">B</span>
                  </div>
                  <p className="text-[12px] text-slate-300">{ACTIVE_ORDER.to}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {ACTIVE_ORDER.cod > 0 && (
                    <span className="text-[12px] font-semibold text-emerald-400">COD: ₫{ACTIVE_ORDER.cod.toLocaleString()}</span>
                  )}
                  <span className="text-[12px] text-slate-500">Cước: ₫{ACTIVE_ORDER.fee.toLocaleString()}</span>
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
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color: s.color }} />
                  <span className="text-[11px] text-slate-500">{s.label}</span>
                </div>
                <p className="text-[20px] font-bold text-white leading-none">{s.value}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{s.unit}</p>
              </div>
            );
          })}
        </div>

        {/* Recent orders */}
        <div className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-white">Đơn gần đây</h3>
            <Link href="/orders" className="text-[11px] text-cyan-400 flex items-center gap-0.5">
              Tất cả <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {RECENT_ORDERS.map((o) => (
              <div key={o.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${o.status === "delivered" ? "bg-emerald-500/15" : "bg-rose-500/15"}`}>
                    {o.status === "delivered"
                      ? <CheckCircle size={14} className="text-emerald-400" />
                      : <AlertCircle size={14} className="text-rose-400" />
                    }
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-white">{o.customer}</p>
                    <p className="text-[10px] text-slate-600">{o.to} · {o.time}</p>
                  </div>
                </div>
                <p className={`text-[12px] font-semibold ${o.status === "delivered" ? "text-emerald-400" : "text-slate-600 line-through"}`}>
                  {o.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-cyan-400" />
            <span className="text-[13px] font-semibold text-white">Khu vực hoạt động</span>
          </div>
          <p className="text-[13px] text-slate-400 mb-2">Bình Thạnh, TP.HCM</p>
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>3 đơn đang chờ gần đây</span>
            <span className="text-cyan-400 font-semibold cursor-pointer">Xem bản đồ →</span>
          </div>
        </div>
      </div>

      <BottomNav active="/" />
    </div>
  );
}
