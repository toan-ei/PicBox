"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/layout";
import {
  TrendingUp, TrendingDown, Package,
  Users, DollarSign, Loader, BarChart3, PieChart,
} from "lucide-react";
import { getAllAdminOrders, getDashboardStats } from "@picbox/utils";
import type { AdminOrder, DashboardStats } from "@picbox/utils";

function fmtMoney(n: number): string {
  if (n >= 1_000_000_000) return `₫${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `₫${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `₫${(n / 1_000).toFixed(0)}K`;
  return `₫${n.toLocaleString()}`;
}

interface BarItem { label: string; value: number; }
interface Segment { label: string; count: number; pct: number; color: string; }

function BarChart({ data }: { data: BarItem[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-0.5 h-44 w-full">
      {data.map((d, i) => (
        <div key={i} className="group relative flex-1 flex flex-col items-center justify-end h-full">
          {d.value > 0 && (
            <div className="absolute bottom-full mb-1.5 hidden group-hover:block bg-[#0c1225] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white whitespace-nowrap z-10 pointer-events-none shadow-lg">
              {d.label}: <span className="font-semibold text-indigo-300">{d.value} đơn</span>
            </div>
          )}
          <div
            className="w-full rounded-t-sm"
            style={{
              height: `${Math.max((d.value / max) * 100, d.value > 0 ? 4 : 0)}%`,
              minHeight: d.value > 0 ? "4px" : "2px",
              background: d.value > 0
                ? `rgba(99,102,241,${0.3 + (d.value / max) * 0.6})`
                : "rgba(255,255,255,0.03)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, total }: { segments: Segment[]; total: number }) {
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <svg viewBox="0 0 36 36" className="h-44 w-44 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3.2" />
          {segments.map((d, i) => {
            const pct = total > 0 ? (d.count / total) * 100 : 0;
            const start = offset;
            offset += pct;
            if (pct < 0.5) return null;
            return (
              <circle
                key={i}
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke={d.color}
                strokeWidth="3.2"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={-start}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] font-bold text-white leading-none">{total}</span>
          <span className="text-[10px] text-slate-500 mt-0.5">đơn hàng</span>
        </div>
      </div>
      <div className="w-full space-y-2">
        {segments.map((d) => (
          <div key={d.label} className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-[12px] text-slate-400 flex-1 truncate">{d.label}</span>
            <span className="text-[11px] text-slate-600 w-6 text-right">{d.count}</span>
            <span className="text-[12px] font-semibold text-white w-8 text-right">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod]   = useState<"week" | "month">("week");
  const [orders, setOrders]   = useState<AdminOrder[]>([]);
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllAdminOrders(), getDashboardStats()])
      .then(([o, s]) => { setOrders(o); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + o.fee, 0), [orders]);
  const totalCOD     = useMemo(() => orders.reduce((s, o) => s + o.codAmount, 0), [orders]);
  const avgFee       = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const deliveryRate = stats && stats.totalOrders > 0
    ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0;
  const failRate = stats && stats.totalOrders > 0
    ? Math.round((stats.failedOrders / stats.totalOrders) * 100) : 0;

  const chartData = useMemo<BarItem[]>(() => {
    const days = period === "week" ? 7 : 30;
    const dates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    const byDay: Record<string, number> = {};
    for (const o of orders) {
      const day = (o.createdAt ?? "").split("T")[0];
      if (day) byDay[day] = (byDay[day] || 0) + 1;
    }
    return dates.map(d => ({
      label: new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
      value: byDay[d] || 0,
    }));
  }, [orders, period]);

  const { segments, segTotal } = useMemo(() => {
    const GROUPS = [
      { label: "Hoàn thành", keys: ["DELIVERED"],                                                  color: "#34d399" },
      { label: "Đang giao",  keys: ["OUT_FOR_DELIVERY", "PICKED_UP", "IN_TRANSIT", "AT_HUB", "SORTING"], color: "#38bdf8" },
      { label: "Chờ xử lý", keys: ["PENDING", "CONFIRMED"],                                        color: "#fbbf24" },
      { label: "Thất bại",   keys: ["DELIVERY_FAILED"],                                             color: "#f87171" },
      { label: "Đã huỷ",    keys: ["CANCELLED"],                                                   color: "#64748b" },
    ];
    const tot = orders.length || 1;
    const segs = GROUPS
      .map(g => ({
        label: g.label, color: g.color,
        count: orders.filter(o => g.keys.includes(o.backendStatus)).length,
        pct: 0,
      }))
      .map(g => ({ ...g, pct: Math.round((g.count / tot) * 100) }))
      .filter(g => g.count > 0);
    return { segments: segs, segTotal: orders.length };
  }, [orders]);

  const KPIs = [
    { label: "Tổng đơn hàng",          value: stats ? String(stats.totalOrders) : "—",
      sub: stats ? `${stats.deliveringOrders} đang giao` : "",  up: true,
      icon: Package,    color: "text-indigo-400",  bg: "bg-indigo-500/[0.08]" },
    { label: "Tỷ lệ giao thành công",  value: `${deliveryRate}%`,
      sub: `${stats?.deliveredOrders ?? 0} đơn hoàn thành`,     up: deliveryRate >= 60,
      icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/[0.08]" },
    { label: "Tổng phí vận chuyển",    value: fmtMoney(totalRevenue),
      sub: `TB ${fmtMoney(avgFee)}/đơn`,                          up: true,
      icon: DollarSign, color: "text-amber-400",   bg: "bg-amber-500/[0.08]" },
    { label: "Người dùng hệ thống",    value: stats ? String(stats.totalUsers) : "—",
      sub: stats ? `${stats.totalShippers} shipper` : "",          up: true,
      icon: Users,      color: "text-purple-400",  bg: "bg-purple-500/[0.08]" },
  ];

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader size={18} className="text-indigo-400 animate-spin" />
          <span className="ml-2.5 text-[13px] text-slate-500">Đang tải dữ liệu phân tích...</span>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-[18px] font-bold text-white">Thống kê & Báo cáo</h1>
              <p className="text-[12px] text-slate-500 mt-0.5">Dữ liệu thực từ hệ thống — cập nhật real-time</p>
            </div>
            <div className="flex gap-1.5">
              {(["week", "month"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                    period === p
                      ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                      : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
                  }`}
                >
                  {p === "week" ? "7 ngày" : "30 ngày"}
                </button>
              ))}
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 stagger">
            {KPIs.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="glass rounded-xl p-4 animate-fadeIn">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-9 w-9 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={16} className={kpi.color} />
                    </div>
                    {kpi.up
                      ? <TrendingUp   size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      : <TrendingDown size={12} className="text-rose-400    mt-0.5 flex-shrink-0" />
                    }
                  </div>
                  <p className="text-[24px] font-bold text-white leading-none">{kpi.value}</p>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">{kpi.label}</p>
                  {kpi.sub && <p className="text-[10px] text-slate-600 mt-0.5">{kpi.sub}</p>}
                </div>
              );
            })}
          </div>

          {/* Chart row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Bar chart */}
            <div className="lg:col-span-2 glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[14px] font-semibold text-white">Đơn hàng theo ngày</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {period === "week" ? "7" : "30"} ngày gần nhất ·{" "}
                    <span className="text-indigo-400 font-medium">{orders.length} tổng</span>
                  </p>
                </div>
                <BarChart3 size={15} className="text-slate-600 flex-shrink-0" />
              </div>

              <BarChart data={chartData} />

              <div className="flex mt-2 gap-0.5">
                {chartData.map((d, i) => {
                  const show = period === "week" || i % 5 === 0 || i === chartData.length - 1;
                  return (
                    <span
                      key={i}
                      className={`flex-1 text-center text-[9px] text-slate-700 truncate ${show ? "" : "opacity-0"}`}
                    >
                      {d.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Donut */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[14px] font-semibold text-white">Trạng thái đơn</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Phân bố thực tế</p>
                </div>
                <PieChart size={15} className="text-slate-600 flex-shrink-0" />
              </div>
              {segments.length > 0 ? (
                <DonutChart segments={segments} total={segTotal} />
              ) : (
                <div className="h-44 flex items-center justify-center text-[13px] text-slate-600">
                  Chưa có dữ liệu
                </div>
              )}
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Finance */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-[14px] font-semibold text-white mb-4">Chi tiết tài chính</h3>
              <div className="divide-y divide-white/[0.04]">
                {[
                  { label: "Tổng phí vận chuyển",  value: fmtMoney(totalRevenue),              color: "text-indigo-400" },
                  { label: "Tổng thu hộ COD",       value: fmtMoney(totalCOD),                 color: "text-amber-400" },
                  { label: "Phí trung bình/đơn",    value: fmtMoney(avgFee),                   color: "text-emerald-400" },
                  { label: "Tổng đơn ghi nhận",     value: `${orders.length} đơn`,             color: "text-sky-400" },
                  { label: "Đơn thất bại",           value: `${stats?.failedOrders ?? 0} đơn`, color: "text-rose-400" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2.5">
                    <span className="text-[12px] text-slate-500">{row.label}</span>
                    <span className={`text-[13px] font-semibold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-[14px] font-semibold text-white mb-4">Hiệu suất hệ thống</h3>

              <div className="space-y-4 mb-5">
                <div>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <span className="text-slate-500">Tỷ lệ giao thành công</span>
                    <span className="text-emerald-400 font-semibold">{deliveryRate}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${deliveryRate}%`,
                        background: "linear-gradient(90deg, #6366f1, #34d399)",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <span className="text-slate-500">Tỷ lệ thất bại</span>
                    <span className="text-rose-400 font-semibold">{failRate}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-500"
                      style={{ width: `${failRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Tổng users",  value: stats?.totalUsers ?? "—",       color: "text-purple-400"  },
                  { label: "Shipper",      value: stats?.totalShippers ?? "—",    color: "text-sky-400"     },
                  { label: "Đang giao",   value: stats?.deliveringOrders ?? "—", color: "text-amber-400"   },
                  { label: "Hoàn thành",  value: stats?.deliveredOrders ?? "—",  color: "text-emerald-400" },
                ].map((row) => (
                  <div key={row.label} className="glass rounded-xl p-3 text-center">
                    <p className={`text-[20px] font-bold ${row.color}`}>{row.value}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{row.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
