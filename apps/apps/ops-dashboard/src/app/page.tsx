"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Package, MapPin, BarChart3,
  Menu, X, AlertTriangle, ChevronRight, Activity,
  Clock, CheckCircle, Truck, Users, TrendingUp, Bell,
} from "lucide-react";

/* ── Sidebar ── */
const NAV = [
  { href: "/", icon: LayoutDashboard, label: "Live Monitor" },
  { href: "/orders", icon: Package, label: "Đơn hàng" },
  { href: "/hubs", icon: MapPin, label: "Hub" },
  { href: "/reports", icon: BarChart3, label: "Báo cáo" },
];

function OpsSidebar({ active }: { active: string }) {
  return (
    <div className="ops-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16" style={{ borderBottom: "1px solid rgba(251,191,36,0.08)" }}>
        <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>
          <Activity size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-white">PicBox Ops</p>
          <p className="text-[10px] text-amber-500/60 font-semibold uppercase tracking-wider">Control Center</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-1">
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = n.href === active;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all relative ${
                isActive ? "text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
              }`}
              style={isActive ? { background: "linear-gradient(90deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)" } : undefined}
            >
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: "linear-gradient(180deg, #f59e0b, #fbbf24)", boxShadow: "0 0 8px rgba(251,191,36,0.5)" }} />}
              <Icon size={16} className={isActive ? "text-amber-400" : ""} />
              {n.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2.5 pb-4" style={{ borderTop: "1px solid rgba(251,191,36,0.06)" }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.02] mt-4">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-[12px] font-bold text-white" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>O</div>
          <div>
            <p className="text-[12px] font-semibold text-white">Ops Manager</p>
            <p className="text-[10px] text-slate-500">ops01@picbox.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Live feed item ── */
const LIVE_FEED = [
  { id: "F001", type: "order_created", msg: "Đơn PB-20260020 được tạo bởi Sender mới", time: "13 giây trước", color: "#6366f1" },
  { id: "F002", type: "shipper_assigned", msg: "Shipper Lê Văn Tùng nhận đơn PB-20260018", time: "45 giây trước", color: "#38bdf8" },
  { id: "F003", type: "delivered", msg: "Đơn PB-20260010 giao thành công", time: "1 phút trước", color: "#34d399" },
  { id: "F004", type: "failed", msg: "Đơn PB-20260009 thất bại: Người nhận vắng mặt", time: "2 phút trước", color: "#f87171" },
  { id: "F005", type: "hub_alert", msg: "Hub Gò Vấp đạt 98% công suất!", time: "3 phút trước", color: "#fbbf24" },
  { id: "F006", type: "order_created", msg: "Đơn PB-20260019 được tạo", time: "4 phút trước", color: "#6366f1" },
  { id: "F007", type: "delivered", msg: "Đơn PB-20260008 giao thành công", time: "5 phút trước", color: "#34d399" },
];

const KPI = [
  { label: "Đơn hôm nay", value: "248", change: "+12", icon: Package, color: "#6366f1", bg: "rgba(99,102,241,0.10)" },
  { label: "Đang giao", value: "87", change: "live", icon: Truck, color: "#38bdf8", bg: "rgba(56,189,248,0.10)" },
  { label: "Hoàn thành", value: "143", change: "57.7%", icon: CheckCircle, color: "#34d399", bg: "rgba(52,211,153,0.10)" },
  { label: "Shipper online", value: "34", change: "+5", icon: Users, color: "#fbbf24", bg: "rgba(251,191,36,0.10)" },
];

const PENDING_ORDERS = [
  { id: "PB-20260020", customer: "Trần Văn Mới", zone: "Quận 7", cod: 250000, wait: "5 phút" },
  { id: "PB-20260019", customer: "Lê Thị Oanh", zone: "Bình Thạnh", cod: 0, wait: "12 phút" },
  { id: "PB-20260015", customer: "Phạm Minh Tuấn", zone: "Gò Vấp", cod: 180000, wait: "18 phút" },
];

export default function OpsMonitorPage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0800]">
      <OpsSidebar active="/" />
      <div className="ops-main">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[20px] font-bold text-white flex items-center gap-2">
                Live Monitor
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
                </span>
              </h1>
              <p className="text-[13px] text-slate-500 mt-0.5">Giám sát thời gian thực — cập nhật mỗi 5s</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-slate-600">14/05/2026 · 18:{String(30 + (tick % 12)).padStart(2,"0")}</span>
              <button className="h-9 w-9 rounded-xl glass flex items-center justify-center relative cursor-pointer">
                <Bell size={15} className="text-slate-400" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
              </button>
            </div>
          </div>

          {/* KPI */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6 stagger">
            {KPI.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="glass rounded-2xl p-5 animate-fadeIn">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: k.bg }}>
                      <Icon size={18} style={{ color: k.color }} />
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: k.color }}>
                      {k.change === "live" ? <span className="animate-pulse-dot">● LIVE</span> : `+${k.change}`}
                    </span>
                  </div>
                  <p className="text-[28px] font-bold text-white leading-none">{k.value}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{k.label}</p>
                </div>
              );
            })}
          </div>

          {/* Main content: feed + pending */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Live feed */}
            <div className="xl:col-span-2 glass rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
                <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                  <Activity size={14} className="text-amber-400" />
                  Luồng sự kiện
                </h3>
                <span className="text-[10px] text-amber-400 font-semibold animate-pulse">● LIVE</span>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {LIVE_FEED.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 px-5 py-3 hover:bg-white/[0.015] transition-colors">
                    <div className="h-2 w-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: ev.color, boxShadow: `0 0 6px ${ev.color}` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-slate-300">{ev.msg}</p>
                    </div>
                    <span className="text-[10px] text-slate-700 flex-shrink-0">{ev.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending orders needing shipper */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
                <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                  <Clock size={14} className="text-amber-400" />
                  Cần gán shipper
                </h3>
                <span className="text-[12px] font-bold text-amber-400">{PENDING_ORDERS.length}</span>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {PENDING_ORDERS.map((o) => (
                  <div key={o.id} className="px-4 py-3.5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[13px] font-semibold text-white">{o.id}</p>
                        <p className="text-[11px] text-slate-500">{o.customer} · {o.zone}</p>
                      </div>
                      <span className="text-[10px] text-amber-400 bg-amber-500/15 border border-amber-500/20 px-1.5 py-0.5 rounded-md font-semibold flex-shrink-0">
                        {o.wait}
                      </span>
                    </div>
                    {o.cod > 0 && <p className="text-[11px] text-emerald-400 mb-2">COD ₫{o.cod.toLocaleString()}</p>}
                    <button
                      className="w-full h-8 rounded-xl text-[12px] font-semibold text-amber-400 border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Truck size={12} /> Gán shipper
                    </button>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(251,191,36,0.04)" }}>
                <Link href="/orders" className="text-[12px] text-amber-400/70 hover:text-amber-400 transition-colors flex items-center gap-1">
                  Xem tất cả đơn <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Hub status mini */}
          <div className="mt-4 glass rounded-2xl p-5">
            <h3 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin size={14} className="text-amber-400" /> Trạng thái Hub
            </h3>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {[
                { name: "Hub Q1", load: 64, status: "ok" },
                { name: "Hub Gò Vấp", load: 98, status: "full" },
                { name: "Hub Bình Dương", load: 52, status: "ok" },
                { name: "Chi nhánh Long An", load: 75, status: "ok" },
              ].map((h) => {
                const color = h.load >= 90 ? "#f87171" : h.load >= 75 ? "#fbbf24" : "#34d399";
                return (
                  <div key={h.name} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[12px] font-medium text-white truncate">{h.name}</p>
                      {h.status === "full" && <AlertTriangle size={12} className="text-amber-400 flex-shrink-0 animate-pulse" />}
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] mb-1.5">
                      <div className="h-full rounded-full transition-all" style={{ width: `${h.load}%`, background: color }} />
                    </div>
                    <p className="text-[11px] font-semibold" style={{ color }}>{h.load}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
