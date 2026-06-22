"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import OpsLayout from "@/components/layout/ops-layout";
import {
  Package, AlertTriangle, ChevronRight, Activity,
  Clock, CheckCircle, Truck, Users, Loader,
} from "lucide-react";
import { getDashboardStats, getAllAdminOrders, getAllHubsAndBranches } from "@picbox/utils";
import type { AdminHub, AdminOrder, DashboardStats } from "@picbox/utils";

function timeSince(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return `${secs}s trước`;
  if (secs < 3600) return `${Math.floor(secs / 60)} phút trước`;
  return `${Math.floor(secs / 3600)} giờ trước`;
}

export default function OpsMonitorPage() {
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [orders, setOrders]   = useState<AdminOrder[]>([]);
  const [hubs, setHubs]       = useState<AdminHub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getAllAdminOrders(),
      getAllHubsAndBranches(),
    ])
      .then(([s, o, h]) => { setStats(s); setOrders(o); setHubs(h); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pendingOrders = orders
    .filter(o => ["pending", "confirmed"].includes(o.status))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 5);

  const recentActivity = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const kpiCards = stats
    ? [
        { label: "Tổng đơn",      value: String(stats.totalOrders),     change: "hôm nay",  icon: Package,     color: "#6366f1", bg: "rgba(99,102,241,0.10)" },
        { label: "Đang giao",     value: String(stats.deliveringOrders), change: "live",     icon: Truck,       color: "#38bdf8", bg: "rgba(56,189,248,0.10)" },
        { label: "Hoàn thành",    value: String(stats.deliveredOrders),  change: stats.totalOrders > 0 ? `${Math.round(stats.deliveredOrders / stats.totalOrders * 100)}%` : "0%", icon: CheckCircle, color: "#34d399", bg: "rgba(52,211,153,0.10)" },
        { label: "Shipper online", value: String(stats.totalShippers),   change: "+active",  icon: Users,       color: "#fbbf24", bg: "rgba(251,191,36,0.10)" },
      ]
    : [];

  return (
    <OpsLayout>
      <div className="mb-6 animate-fadeIn">
        <h2 className="text-[20px] font-bold text-white flex items-center gap-2">
          Live Monitor
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
          </span>
        </h2>
        <p className="text-[13px] text-slate-500 mt-0.5">Giám sát thời gian thực hệ thống vận hành chặng cuối</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader size={24} className="text-amber-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6 stagger">
            {kpiCards.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="glass rounded-2xl p-4 sm:p-5 animate-fadeIn hover:scale-[1.02] transition-transform cursor-default">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: k.bg }}>
                      <Icon size={18} style={{ color: k.color }} />
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: k.color }}>
                      {k.change === "live" ? <span className="animate-pulse">● LIVE</span> : k.change}
                    </span>
                  </div>
                  <p className="text-[26px] sm:text-[28px] font-bold text-white leading-none">{k.value}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{k.label}</p>
                </div>
              );
            })}
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Activity feed */}
            <div className="xl:col-span-2 glass rounded-2xl overflow-hidden animate-fadeIn">
              <div className="flex items-center justify-between px-4 sm:px-5 py-3.5" style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
                <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                  <Activity size={14} className="text-amber-400" />
                  Đơn hàng gần đây
                </h3>
                <span className="text-[10px] text-amber-400 font-semibold animate-pulse">● LIVE</span>
              </div>
              <div className="divide-y divide-white/[0.03] max-h-[420px] overflow-y-auto">
                {recentActivity.length === 0 && (
                  <p className="text-center text-[13px] text-slate-600 py-8">Không có dữ liệu</p>
                )}
                {recentActivity.map((o) => {
                  const icon = o.status === "delivered" ? "✅" : o.status === "failed" ? "❌" : o.status === "out_for_delivery" ? "🛵" : "📦";
                  return (
                    <div key={o.id} className="flex items-start gap-3 px-4 sm:px-5 py-3.5 hover:bg-white/[0.015] transition-colors">
                      <span className="text-[14px] flex-shrink-0 mt-0.5">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-slate-300 leading-relaxed">
                          Đơn <span className="text-amber-300 font-semibold">{o.trackingCode}</span> — {o.receiverName} ({o.destBranchName || o.receiverAddress.split(",")[0]})
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-700 flex-shrink-0 whitespace-nowrap">{timeSince(o.createdAt)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pending queue */}
            <div className="glass rounded-2xl overflow-hidden animate-fadeIn">
              <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
                <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                  <Clock size={14} className="text-amber-400" />
                  Hàng đợi gán shipper
                </h3>
                <span className="text-[11px] bg-rose-500/15 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-lg font-semibold">
                  {pendingOrders.length}
                </span>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {pendingOrders.length === 0 && (
                  <p className="text-center text-[13px] text-slate-600 py-8">Không có đơn chờ</p>
                )}
                {pendingOrders.map((o) => (
                  <div key={o.id} className="px-4 py-3.5 hover:bg-white/[0.015] transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-bold text-white">{o.trackingCode}</span>
                      {o.codAmount > 0 && (
                        <span className="text-[11px] text-emerald-400 font-semibold">COD ₫{o.codAmount.toLocaleString()}</span>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-400 truncate">{o.receiverName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-slate-600 flex items-center gap-1">
                        <Clock size={10} /> {timeSince(o.createdAt)}
                      </span>
                      <Link href={`/orders?q=${o.trackingCode}`} className="text-[11px] text-amber-400 flex items-center gap-0.5 hover:text-amber-300">
                        Gán <ChevronRight size={11} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hubs overview */}
          {hubs.length > 0 && (
            <div className="mt-4 glass rounded-2xl overflow-hidden animate-fadeIn">
              <div className="flex items-center justify-between px-4 sm:px-5 py-3.5" style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
                <h3 className="text-[14px] font-semibold text-white">Trạng thái Hub / Chi nhánh</h3>
                <Link href="/hubs" className="text-[11px] text-amber-400 flex items-center gap-0.5">
                  Xem tất cả <ChevronRight size={11} />
                </Link>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-px">
                {hubs.slice(0, 4).map((hub) => (
                  <div key={hub.id} className="p-4 hover:bg-white/[0.015] transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${hub.active ? "bg-emerald-400" : "bg-rose-400"}`} />
                      <p className="text-[12px] font-semibold text-white truncate">{hub.name}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 capitalize">{hub.type === "hub" ? "Trung tâm" : "Chi nhánh"}</p>
                    {hub.maxCapacity && (
                      <p className="text-[11px] text-slate-600 mt-1">SL tối đa: {hub.maxCapacity}</p>
                    )}
                    {!hub.active && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle size={10} className="text-amber-400" />
                        <span className="text-[10px] text-amber-400">Không hoạt động</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </OpsLayout>
  );
}
