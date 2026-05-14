"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3, TrendingUp, TrendingDown, Download, Calendar,
  Package, DollarSign, Users, CheckCircle, XCircle,
  LayoutDashboard, MapPin, Activity,
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
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: "#fbbf24" }} />}
              <Icon size={16} className={isActive ? "text-amber-400" : ""} />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

const WEEKS = ["T.2", "T.3", "T.4", "T.5", "T.6", "T.7", "CN"];
const DAILY_ORDERS = [38, 42, 35, 48, 52, 29, 18];
const DAILY_REVENUE = [14.2, 16.8, 13.5, 18.6, 20.1, 11.4, 7.2]; // triệu

function MiniBar({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-md transition-all hover:opacity-80"
            style={{ height: `${(v / max) * 100}%`, minHeight: 6, background: color, opacity: 0.5 + (i / data.length) * 0.5 }}
            title={String(v)}
          />
        </div>
      ))}
    </div>
  );
}

const DAILY_TABLE = [
  { date: "14/05", orders: 52, delivered: 38, failed: 4, revenue: "₫20.1M", rate: "73%" },
  { date: "13/05", orders: 48, delivered: 42, failed: 2, revenue: "₫18.6M", rate: "87%" },
  { date: "12/05", orders: 35, delivered: 30, failed: 3, revenue: "₫13.5M", rate: "85%" },
  { date: "11/05", orders: 42, delivered: 38, failed: 1, revenue: "₫16.8M", rate: "90%" },
  { date: "10/05", orders: 38, delivered: 32, failed: 5, revenue: "₫14.2M", rate: "84%" },
];

export default function OpsReportsPage() {
  const [period, setPeriod] = useState<"week" | "month">("week");

  const totalOrders = DAILY_TABLE.reduce((s, d) => s + d.orders, 0);
  const totalDelivered = DAILY_TABLE.reduce((s, d) => s + d.delivered, 0);
  const totalFailed = DAILY_TABLE.reduce((s, d) => s + d.failed, 0);
  const successRate = Math.round((totalDelivered / totalOrders) * 100);

  return (
    <div className="min-h-screen bg-[#0c0800]">
      <OpsSidebar active="/reports" />
      <div className="ops-main p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-bold text-white">Báo cáo vận hành</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Tổng hợp hiệu suất theo kỳ</p>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,191,36,0.08)" }}>
              {(["week","month"] as const).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                    period === p ? "bg-amber-500/20 text-amber-300 border border-amber-500/25" : "text-slate-500"
                  }`}
                >
                  {p === "week" ? "7 ngày" : "Tháng"}
                </button>
              ))}
            </div>
            <button className="h-9 px-4 rounded-xl glass text-[13px] text-slate-400 flex items-center gap-2 hover:bg-white/[0.06] transition-all cursor-pointer">
              <Download size={14} /> Xuất Excel
            </button>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5 stagger">
          {[
            { label: "Tổng đơn 7 ngày", value: totalOrders, change: "+8.2%", up: true, icon: Package, color: "#6366f1" },
            { label: "Hoàn thành", value: `${totalDelivered} (${successRate}%)`, change: "+3.1%", up: true, icon: CheckCircle, color: "#34d399" },
            { label: "Thất bại", value: totalFailed, change: "-1.2%", up: false, icon: XCircle, color: "#f87171" },
            { label: "Doanh thu 7 ngày", value: "₫101.4M", change: "+12.5%", up: true, icon: DollarSign, color: "#fbbf24" },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="glass rounded-2xl p-5 animate-fadeIn">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: k.color + "15" }}>
                    <Icon size={18} style={{ color: k.color }} />
                  </div>
                  <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${k.up ? "text-emerald-400" : "text-rose-400"}`}>
                    {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {k.change}
                  </span>
                </div>
                <p className="text-[22px] font-bold text-white leading-none">{k.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{k.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-white">Đơn hàng 7 ngày</h3>
              <span className="text-[12px] text-amber-400 font-semibold flex items-center gap-1">
                <TrendingUp size={12} /> +8.2%
              </span>
            </div>
            <MiniBar data={DAILY_ORDERS} color="#f59e0b" />
            <div className="flex gap-1.5 mt-2">
              {WEEKS.map((d) => <span key={d} className="flex-1 text-center text-[9px] text-slate-700">{d}</span>)}
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-white">Doanh thu 7 ngày (triệu VND)</h3>
              <span className="text-[12px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp size={12} /> +12.5%
              </span>
            </div>
            <MiniBar data={DAILY_REVENUE} color="#34d399" />
            <div className="flex gap-1.5 mt-2">
              {WEEKS.map((d) => <span key={d} className="flex-1 text-center text-[9px] text-slate-700">{d}</span>)}
            </div>
          </div>
        </div>

        {/* Daily table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
            <h3 className="text-[14px] font-semibold text-white">Chi tiết theo ngày</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {["Ngày", "Tổng đơn", "Hoàn thành", "Thất bại", "Tỷ lệ thành công", "Doanh thu"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAILY_TABLE.map((row, i) => (
                <tr key={row.date} className="hover:bg-white/[0.015] transition-colors" style={i < DAILY_TABLE.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.03)" } : undefined}>
                  <td className="px-4 py-3 text-[13px] font-semibold text-white">
                    {row.date}
                    {i === 0 && <span className="ml-2 text-[10px] text-amber-400 bg-amber-500/15 border border-amber-500/20 px-1.5 py-0.5 rounded-md">Hôm nay</span>}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-slate-300">{row.orders}</td>
                  <td className="px-4 py-3 text-[13px] text-emerald-400 font-semibold">{row.delivered}</td>
                  <td className="px-4 py-3 text-[13px] text-rose-400">{row.failed}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full" style={{
                          width: row.rate,
                          background: parseInt(row.rate) >= 85 ? "#34d399" : "#fbbf24",
                        }} />
                      </div>
                      <span className="text-[12px] text-slate-400">{row.rate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-amber-400 font-semibold">{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
