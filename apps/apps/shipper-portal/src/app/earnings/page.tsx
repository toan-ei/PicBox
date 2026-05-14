"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TrendingUp, DollarSign, Package, Home, List, Wallet, User, Calendar } from "lucide-react";

function BottomNav({ active }: { active: string }) {
  const NAV = [
    { href: "/", icon: Home, label: "Trang chủ" },
    { href: "/orders", icon: List, label: "Đơn hàng" },
    { href: "/earnings", icon: Wallet, label: "Thu nhập" },
    { href: "/profile", icon: User, label: "Tài khoản" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{ background: "rgba(4,12,28,0.97)", borderTop: "1px solid rgba(56,189,248,0.10)", backdropFilter: "blur(20px)" }}>
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${isActive ? "" : "opacity-50"}`}>
            <Icon size={20} className={isActive ? "text-cyan-400" : "text-slate-500"} />
            <span className={`text-[10px] font-semibold ${isActive ? "text-cyan-400" : "text-slate-600"}`}>{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

const DAILY = [
  { date: "14/05", orders: 12, cod: 625000, fee: 485000 },
  { date: "13/05", orders: 9,  cod: 380000, fee: 352000 },
  { date: "12/05", orders: 14, cod: 780000, fee: 560000 },
  { date: "11/05", orders: 11, cod: 420000, fee: 430000 },
  { date: "10/05", orders: 8,  cod: 0,      fee: 290000 },
];

export default function EarningsPage() {
  const [period, setPeriod] = useState<"week" | "month">("week");

  const totalFee = DAILY.reduce((s, d) => s + d.fee, 0);
  const totalCod = DAILY.reduce((s, d) => s + d.cod, 0);
  const totalOrders = DAILY.reduce((s, d) => s + d.orders, 0);

  const maxFee = Math.max(...DAILY.map((d) => d.fee));

  return (
    <div className="min-h-screen bg-[#020c18]">
      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-[20px] font-bold text-white">Thu nhập</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Tổng hợp doanh thu của bạn</p>
        </div>

        {/* Period toggle */}
        <div className="flex gap-2 mb-5 p-1 rounded-2xl w-fit" style={{ background: "rgba(8,20,40,0.7)", border: "1px solid rgba(56,189,248,0.08)" }}>
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                period === p ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/25" : "text-slate-500"
              }`}
            >
              {p === "week" ? "7 ngày" : "Tháng này"}
            </button>
          ))}
        </div>

        {/* Main earning card */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{
            background: "linear-gradient(135deg, rgba(14,165,233,0.20) 0%, rgba(6,182,212,0.12) 100%)",
            border: "1px solid rgba(56,189,248,0.25)",
            boxShadow: "0 8px 32px -8px rgba(14,165,233,0.3)",
          }}
        >
          <p className="text-[12px] text-cyan-300/70 uppercase tracking-wider font-semibold mb-2">Tổng thu nhập</p>
          <p className="text-[36px] font-bold text-white leading-none mb-4">
            ₫{(totalFee / 1000).toFixed(0)}k
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Đơn hoàn thành", value: totalOrders.toString() },
              { label: "Cước phí", value: `₫${(totalFee / 1000).toFixed(0)}k` },
              { label: "Đã thu COD", value: `₫${(totalCod / 1000).toFixed(0)}k` },
            ].map((s) => (
              <div key={s.label} className="text-center rounded-xl bg-white/[0.06] border border-white/[0.08] py-2.5">
                <p className="text-[14px] font-bold text-white">{s.value}</p>
                <p className="text-[9px] text-cyan-300/60 mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily chart */}
        <div className="glass-card p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-white">Thu nhập theo ngày</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp size={12} /> +18% vs tuần trước
            </span>
          </div>
          <div className="flex items-end gap-2 h-20 mb-2">
            {DAILY.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${(d.fee / maxFee) * 100}%`,
                    minHeight: 8,
                    background: "linear-gradient(180deg, #0ea5e9, #06b6d4)",
                    boxShadow: "0 0 8px rgba(14,165,233,0.3)",
                    opacity: 0.5 + (d.fee / maxFee) * 0.5,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {DAILY.map((d) => (
              <div key={d.date} className="flex-1 text-center">
                <span className="text-[9px] text-slate-600">{d.date.split("/")[0]}/{d.date.split("/")[1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily breakdown */}
        <div className="glass-card p-4">
          <h3 className="text-[13px] font-semibold text-white mb-3">Chi tiết từng ngày</h3>
          <div className="space-y-3">
            {DAILY.map((d, i) => (
              <div key={d.date} className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${i === 0 ? "bg-cyan-500/20" : "bg-white/[0.04]"}`}>
                  <Calendar size={13} className={i === 0 ? "text-cyan-400" : "text-slate-600"} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[12px] font-medium text-white">{d.date} {i === 0 && <span className="text-[10px] text-cyan-400 ml-1">Hôm nay</span>}</p>
                    <p className="text-[12px] font-bold text-white">₫{d.fee.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-600">
                    <span>{d.orders} đơn</span>
                    {d.cod > 0 && <span className="text-emerald-500">COD ₫{d.cod.toLocaleString()}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="/earnings" />
    </div>
  );
}
