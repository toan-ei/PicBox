"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin, Package, AlertTriangle, Activity,
  LayoutDashboard, BarChart3, CheckCircle, XCircle, Loader,
} from "lucide-react";
import { getAllHubsAndBranches } from "@picbox/utils";
import type { AdminHub } from "@picbox/utils";

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

export default function OpsHubsPage() {
  const [hubs, setHubs]       = useState<AdminHub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllHubsAndBranches()
      .then(setHubs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeHubs    = hubs.filter(h => h.active);
  const inactiveHubs  = hubs.filter(h => !h.active);
  const hubCount      = hubs.filter(h => h.type === "hub").length;
  const branchCount   = hubs.filter(h => h.type === "branch").length;

  return (
    <div className="min-h-screen bg-[#0c0800]">
      <OpsSidebar active="/hubs" />
      <div className="ops-main p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-bold text-white">Quản lý Hub</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Giám sát trạng thái hub và chi nhánh trong mạng lưới</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size={24} className="text-amber-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary KPI */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5 stagger">
              {[
                { label: "Tổng điểm",      value: hubs.length,       color: "#6366f1" },
                { label: "Hub trung tâm",  value: hubCount,          color: "#fbbf24" },
                { label: "Chi nhánh",      value: branchCount,       color: "#38bdf8" },
                { label: "Đang hoạt động", value: activeHubs.length, color: "#34d399" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4 animate-fadeIn">
                  <p className="text-[28px] font-bold text-white leading-none">{s.value}</p>
                  <p className="text-[11px] mt-2" style={{ color: s.color }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Inactive alert */}
            {inactiveHubs.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5 animate-fadeIn" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
                <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
                <p className="text-[13px] text-amber-300">
                  <span className="font-bold">{inactiveHubs.length}</span> điểm không hoạt động: {inactiveHubs.map(h => h.name).join(", ")}
                </p>
              </div>
            )}

            {/* Hubs grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {hubs.map((hub) => (
                <div key={hub.id} className="glass rounded-2xl p-5 hover:border-amber-500/15 transition-all duration-200 animate-fadeIn">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${hub.type === "hub" ? "bg-amber-500/[0.12]" : "bg-orange-500/[0.10]"}`}>
                        <MapPin size={16} className={hub.type === "hub" ? "text-amber-400" : "text-orange-400"} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white">{hub.name}</p>
                        <p className="text-[10px] text-slate-600 capitalize">{hub.type === "hub" ? "Hub trung tâm" : "Chi nhánh"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {hub.active
                        ? <><CheckCircle size={13} className="text-emerald-400" /><span className="text-[11px] font-semibold text-emerald-400">Hoạt động</span></>
                        : <><XCircle size={13} className="text-rose-400" /><span className="text-[11px] font-semibold text-rose-400">Tạm ngừng</span></>
                      }
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    {hub.address && (
                      <div className="flex items-start gap-2 text-[12px] text-slate-500">
                        <MapPin size={12} className="text-slate-700 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{hub.address}</span>
                      </div>
                    )}
                    {hub.province && (
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <span className="text-[11px] px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/15 font-medium">
                          {hub.province}
                        </span>
                      </div>
                    )}
                    {hub.contactPhone && (
                      <a href={`tel:${hub.contactPhone}`} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300 transition-colors">
                        <span>📞</span> {hub.contactPhone}
                      </a>
                    )}
                  </div>

                  {/* Capacity */}
                  {hub.maxCapacity && (
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2.5 mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-600">Công suất tối đa</span>
                        <span className="text-[13px] font-bold text-amber-400">{hub.maxCapacity.toLocaleString()} kiện</span>
                      </div>
                    </div>
                  )}

                  {/* ID tag */}
                  <p className="text-[10px] text-slate-700 font-mono">{hub.id}</p>
                </div>
              ))}
            </div>

            {hubs.length === 0 && (
              <div className="text-center py-16 text-slate-600">
                <MapPin size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-[14px]">Không có hub nào</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
