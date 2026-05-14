"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout";
import { TrendingUp, TrendingDown, Package, Truck, Users, DollarSign, BarChart3, Calendar } from "lucide-react";

const MONTHS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

// Mock chart data (orders per month)
const ORDER_DATA = [820, 950, 1100, 1280, 1450, 1380, 1600, 1750, 1900, 2050, 1980, 2200];
const REVENUE_DATA = [185, 210, 245, 290, 320, 305, 360, 395, 430, 460, 445, 490]; // in millions

const SHIPPER_PERF = [
  { name: "Ngô Văn Tùng", orders: 210, rating: 4.9, earnings: "₫9.8M" },
  { name: "Lê Văn Shipper", orders: 198, rating: 4.8, earnings: "₫8.5M" },
  { name: "Đinh Thị Loan", orders: 175, rating: 4.7, earnings: "₫7.1M" },
  { name: "Võ Thị Mai", orders: 160, rating: 4.6, earnings: "₫6.2M" },
  { name: "Trần Minh Khoa", orders: 110, rating: 4.3, earnings: "₫3.2M" },
];

const ORDER_STATUSES = [
  { label: "Hoàn thành", value: 72, color: "#34d399" },
  { label: "Đang giao", value: 15, color: "#38bdf8" },
  { label: "Chờ xử lý", value: 8, color: "#fbbf24" },
  { label: "Thất bại", value: 5, color: "#f87171" },
];

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-300 hover:opacity-80"
          style={{
            height: `${(v / max) * 100}%`,
            background: color,
            opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.5,
          }}
          title={`${MONTHS[i]}: ${v}`}
        />
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 36 36" className="h-28 w-28 flex-shrink-0">
        {data.map((d, i) => {
          const pct = (d.value / total) * 100;
          const dash = pct;
          const gap = 100 - pct;
          const startOffset = offset;
          offset += pct;
          return (
            <circle
              key={i}
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke={d.color}
              strokeWidth="3.5"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-startOffset}
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
            />
          );
        })}
        <text x="18" y="20" textAnchor="middle" className="fill-white text-[5px] font-bold">
          {total}%
        </text>
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-[12px] text-slate-400">{d.label}</span>
            <span className="text-[12px] font-semibold text-white ml-auto pl-2">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const KPIs = [
    {
      label: "Doanh thu tháng 5",
      value: "₫320M",
      change: "+18.3%",
      up: true,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/[0.08]",
    },
    {
      label: "Đơn hàng tháng 5",
      value: "1,450",
      change: "+12.5%",
      up: true,
      icon: Package,
      color: "text-indigo-400",
      bg: "bg-indigo-500/[0.08]",
    },
    {
      label: "Shipper hoạt động",
      value: "186",
      change: "-2.1%",
      up: false,
      icon: Truck,
      color: "text-sky-400",
      bg: "bg-sky-500/[0.08]",
    },
    {
      label: "Người dùng mới",
      value: "3,241",
      change: "+8.2%",
      up: true,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/[0.08]",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Thống kê & Báo cáo</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Phân tích hiệu suất vận hành hệ thống PicBox</p>
          </div>
          <div className="flex gap-1.5">
            {(["week", "month", "year"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                  period === p
                    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                    : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
                }`}
              >
                {p === "week" ? "Tuần" : p === "month" ? "Tháng" : "Năm"}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 stagger">
          {KPIs.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="glass rounded-2xl p-5 animate-fadeIn">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-10 w-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                    <Icon size={18} className={kpi.color} />
                  </div>
                  <span className={`text-[12px] font-semibold flex items-center gap-0.5 ${kpi.up ? "text-emerald-400" : "text-rose-400"}`}>
                    {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {kpi.change}
                  </span>
                </div>
                <p className="text-[26px] font-bold text-white leading-none">{kpi.value}</p>
                <p className="text-[11px] text-slate-500 mt-1.5">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Orders chart */}
          <div className="lg:col-span-2 glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-semibold text-white">Đơn hàng theo tháng</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Năm 2026</p>
              </div>
              <span className="text-[12px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp size={12} /> +167.7% YTD
              </span>
            </div>
            <MiniBarChart data={ORDER_DATA} color="#6366f1" />
            <div className="flex justify-between mt-2">
              {MONTHS.map((m) => (
                <span key={m} className="text-[9px] text-slate-700 flex-1 text-center">{m}</span>
              ))}
            </div>
          </div>

          {/* Order status donut */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-[14px] font-semibold text-white mb-4">Tỷ lệ trạng thái đơn</h3>
            <DonutChart data={ORDER_STATUSES} />
          </div>
        </div>

        {/* Revenue chart */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[14px] font-semibold text-white">Doanh thu theo tháng (triệu VND)</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Tổng năm 2026: ₫3.92 tỷ</p>
            </div>
            <span className="text-[12px] text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp size={12} /> +165% vs 2025
            </span>
          </div>
          <MiniBarChart data={REVENUE_DATA} color="#34d399" />
          <div className="flex justify-between mt-2">
            {MONTHS.map((m) => (
              <span key={m} className="text-[9px] text-slate-700 flex-1 text-center">{m}</span>
            ))}
          </div>
        </div>

        {/* Shipper leaderboard */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-[14px] font-semibold text-white mb-4">Top Shipper tháng này</h3>
          <div className="space-y-3">
            {SHIPPER_PERF.map((s, i) => (
              <div key={s.name} className="flex items-center gap-4">
                <span
                  className={`h-7 w-7 rounded-xl flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${
                    i === 0 ? "bg-amber-500/20 text-amber-400" :
                    i === 1 ? "bg-slate-500/20 text-slate-300" :
                    i === 2 ? "bg-orange-500/20 text-orange-400" :
                    "bg-white/[0.04] text-slate-600"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[13px] font-medium text-white truncate">{s.name}</p>
                    <p className="text-[12px] text-slate-400 flex-shrink-0 ml-2">{s.earnings}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(s.orders / SHIPPER_PERF[0].orders) * 100}%`,
                          background: i === 0 ? "#fbbf24" : "#6366f1",
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-600 flex-shrink-0">{s.orders} đơn · ⭐{s.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
