"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin, Package, Users, AlertTriangle, Plus, Activity,
  LayoutDashboard, BarChart3, TrendingDown, TrendingUp,
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

const HUBS = [
  { id: "HUB-HCM-01", name: "Hub Trung Tâm Q1", type: "hub", capacity: 500, load: 320, shippers: { online: 18, total: 45 }, pendingOrders: 87, queuedDrivers: 2, status: "ok" },
  { id: "HUB-HCM-02", name: "Hub Gò Vấp",       type: "hub", capacity: 300, load: 295, shippers: { online: 12, total: 28 }, pendingOrders: 63, queuedDrivers: 1, status: "full" },
  { id: "HUB-BD-01",  name: "Hub Bình Dương",   type: "hub", capacity: 400, load: 210, shippers: { online: 15, total: 32 }, pendingOrders: 55, queuedDrivers: 0, status: "ok" },
  { id: "BR-HCM-01",  name: "Chi nhánh Bình Thạnh", type: "branch", capacity: 150, load: 80, shippers: { online: 8, total: 15 }, pendingOrders: 24, queuedDrivers: 0, status: "ok" },
  { id: "BR-HCM-02",  name: "Chi nhánh Tân Bình",   type: "branch", capacity: 200, load: 45, shippers: { online: 0, total: 18 }, pendingOrders: 31, queuedDrivers: 0, status: "maintenance" },
  { id: "BR-LA-01",   name: "Chi nhánh Long An",    type: "branch", capacity: 120, load: 90, shippers: { online: 6, total: 10 }, pendingOrders: 18, queuedDrivers: 1, status: "ok" },
];

export default function OpsHubsPage() {
  const totalCapacity = HUBS.reduce((s, h) => s + h.capacity, 0);
  const totalLoad = HUBS.reduce((s, h) => s + h.load, 0);
  const fullHubs = HUBS.filter((h) => h.status === "full").length;

  return (
    <div className="min-h-screen bg-[#0c0800]">
      <OpsSidebar active="/hubs" />
      <div className="ops-main p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-bold text-white">Quản lý Hub</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Giám sát công suất và điều phối luồng hàng</p>
          </div>
          <button className="h-9 px-4 rounded-xl text-white text-[13px] font-semibold flex items-center gap-2 cursor-pointer transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>
            <Plus size={14} /> Thêm Hub
          </button>
        </div>

        {/* System KPI */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5 stagger">
          {[
            { label: "Tổng công suất", value: totalCapacity, unit: "kiện", color: "#6366f1" },
            { label: "Đang chứa", value: `${Math.round(totalLoad/totalCapacity*100)}%`, unit: `${totalLoad}/${totalCapacity}`, color: "#fbbf24" },
            { label: "Hub đầy tải", value: fullHubs, unit: "hub", color: "#f87171" },
            { label: "Hub hoạt động", value: HUBS.filter(h=>h.status==="ok").length, unit: "hub", color: "#34d399" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 animate-fadeIn">
              <p className="text-[28px] font-bold text-white leading-none">{s.value}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{s.unit}</p>
              <p className="text-[11px] mt-2" style={{ color: s.color }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Hubs grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {HUBS.map((hub) => {
            const loadPct = Math.round((hub.load / hub.capacity) * 100);
            const loadColor = loadPct >= 90 ? "#f87171" : loadPct >= 70 ? "#fbbf24" : "#34d399";
            const statusLabel = hub.status === "full" ? "Đầy tải" : hub.status === "maintenance" ? "Bảo trì" : "Hoạt động";
            const statusColor = hub.status === "full" ? "text-amber-400" : hub.status === "maintenance" ? "text-slate-500" : "text-emerald-400";

            return (
              <div key={hub.id} className="glass rounded-2xl p-5 hover:border-amber-500/15 transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${hub.type === "hub" ? "bg-amber-500/[0.12]" : "bg-orange-500/[0.10]"}`}>
                      <MapPin size={16} className={hub.type === "hub" ? "text-amber-400" : "text-orange-400"} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white">{hub.name}</p>
                      <p className="text-[10px] text-slate-600">{hub.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hub.status === "full" && <AlertTriangle size={13} className="text-amber-400 animate-pulse" />}
                    <span className={`text-[11px] font-semibold ${statusColor}`}>{statusLabel}</span>
                  </div>
                </div>

                {/* Capacity bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] text-slate-600">Công suất</span>
                    <span className="text-[11px] font-bold" style={{ color: loadColor }}>{loadPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${loadPct}%`, background: loadColor, boxShadow: `0 0 8px ${loadColor}40` }} />
                  </div>
                  <p className="text-[10px] text-slate-700 mt-1">{hub.load} / {hub.capacity} kiện</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center rounded-xl bg-white/[0.03] border border-white/[0.04] py-2.5">
                    <p className="text-[14px] font-bold text-white">{hub.shippers.online}</p>
                    <p className="text-[9px] text-slate-600 mt-0.5">Online</p>
                  </div>
                  <div className="text-center rounded-xl bg-white/[0.03] border border-white/[0.04] py-2.5">
                    <p className="text-[14px] font-bold text-white">{hub.pendingOrders}</p>
                    <p className="text-[9px] text-slate-600 mt-0.5">Chờ giao</p>
                  </div>
                  <div className="text-center rounded-xl bg-white/[0.03] border border-white/[0.04] py-2.5">
                    <p className="text-[14px] font-bold text-white">{hub.queuedDrivers}</p>
                    <p className="text-[9px] text-slate-600 mt-0.5">Driver chờ</p>
                  </div>
                </div>

                {/* Action */}
                {hub.status === "full" && (
                  <button className="w-full h-8 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-400 text-[11px] font-semibold hover:bg-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                    <TrendingDown size={12} /> Chuyển tải sang hub khác
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
