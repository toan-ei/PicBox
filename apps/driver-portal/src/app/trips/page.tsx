"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck, Package, Clock, CheckCircle, ChevronRight, Search,
  ArrowLeftRight, Home, Map, User, Loader,
} from "lucide-react";
import { getInTransitOrders } from "@picbox/utils";
import type { AdminOrder } from "@picbox/utils";

function BottomNav({ active }: { active: string }) {
  const NAV = [
    { href: "/", icon: Home, label: "Tổng quan" },
    { href: "/routes", icon: Map, label: "Lộ trình" },
    { href: "/trips", icon: ArrowLeftRight, label: "Chuyến hàng" },
    { href: "/profile", icon: User, label: "Tài khoản" },
  ];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{ background: "rgba(2,9,5,0.97)", borderTop: "1px solid rgba(52,211,153,0.10)", backdropFilter: "blur(20px)" }}
    >
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${isActive ? "" : "opacity-50"}`}>
            <Icon size={20} className={isActive ? "text-emerald-400" : "text-slate-500"} />
            <span className={`text-[10px] font-semibold ${isActive ? "text-emerald-400" : "text-slate-600"}`}>{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

const STATUS_CFG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  AT_ORIGIN_BRANCH:          { label: "Chờ lấy",         icon: Clock,        color: "text-slate-400",   bg: "bg-slate-500/15",   border: "border-slate-500/20" },
  IN_TRANSIT_TO_HUB:         { label: "→ Hub",            icon: Truck,        color: "text-cyan-400",    bg: "bg-cyan-500/15",    border: "border-cyan-500/20" },
  AT_HUB:                    { label: "Tại Hub",          icon: Package,      color: "text-blue-400",    bg: "bg-blue-500/15",    border: "border-blue-500/20" },
  IN_TRANSIT_TO_DEST_HUB:    { label: "Hub → Hub",        icon: Truck,        color: "text-indigo-400",  bg: "bg-indigo-500/15",  border: "border-indigo-500/20" },
  AT_DEST_HUB:               { label: "Hub đích",         icon: Package,      color: "text-violet-400",  bg: "bg-violet-500/15",  border: "border-violet-500/20" },
  IN_TRANSIT_TO_DEST_BRANCH: { label: "→ CN đích",        icon: Truck,        color: "text-sky-400",     bg: "bg-sky-500/15",     border: "border-sky-500/20" },
  AT_DEST_BRANCH:            { label: "Tại CN đích",      icon: CheckCircle,  color: "text-teal-400",    bg: "bg-teal-500/15",    border: "border-teal-500/20" },
};

const TABS = [
  { key: "all",     label: "Tất cả" },
  { key: "active",  label: "Đang chạy" },
  { key: "waiting", label: "Chờ xử lý" },
];

const ACTIVE_SET  = new Set(["IN_TRANSIT_TO_HUB", "IN_TRANSIT_TO_DEST_HUB", "IN_TRANSIT_TO_DEST_BRANCH"]);
const WAITING_SET = new Set(["AT_ORIGIN_BRANCH", "AT_HUB", "AT_DEST_HUB", "AT_DEST_BRANCH"]);

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

export default function TripsListPage() {
  const [tab, setTab]       = useState("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInTransitOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.trackingCode.toLowerCase().includes(q) ||
      o.receiverName.toLowerCase().includes(q) ||
      (o.destBranchName || "").toLowerCase().includes(q);
    const matchTab =
      tab === "all"     ? true :
      tab === "active"  ? ACTIVE_SET.has(o.backendStatus) :
      WAITING_SET.has(o.backendStatus);
    return matchSearch && matchTab;
  });

  const activeCount  = orders.filter(o => ACTIVE_SET.has(o.backendStatus)).length;
  const waitingCount = orders.filter(o => WAITING_SET.has(o.backendStatus)).length;

  return (
    <div className="min-h-screen bg-[#020f0a]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        <div className="mb-5 animate-fadeIn">
          <h1 className="text-[20px] font-bold text-white">Chuyến hàng</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Kiện hàng đang trung chuyển</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size={20} className="text-emerald-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3 mb-5 stagger">
              {[
                { label: "Tổng",        value: orders.length,  icon: ArrowLeftRight, color: "#34d399" },
                { label: "Đang chạy",   value: activeCount,    icon: Truck,          color: "#6ee7b7" },
                { label: "Chờ xử lý",   value: waitingCount,   icon: Package,        color: "#a7f3d0" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="glass-card p-3 text-center animate-fadeIn">
                    <Icon size={16} className="mx-auto mb-1.5" style={{ color: s.color }} />
                    <p className="text-[14px] font-bold text-white">{s.value}</p>
                    <p className="text-[9px] text-slate-600 mt-0.5">{s.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative mb-4 animate-fadeIn">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mã đơn, người nhận..."
                className="w-full h-10 rounded-2xl pl-10 pr-4 text-[13px] text-slate-300 placeholder-slate-600 outline-none transition-all"
                style={{ background: "rgba(5,18,12,0.8)", border: "1px solid rgba(52,211,153,0.10)" }}
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 p-1 rounded-2xl" style={{ background: "rgba(5,18,12,0.7)", border: "1px solid rgba(52,211,153,0.08)" }}>
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                    tab === t.key
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Order list */}
            <div className="space-y-3">
              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-600">
                  <ArrowLeftRight size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-[13px]">Không có đơn nào</p>
                </div>
              )}
              {filtered.map((o) => {
                const sc = STATUS_CFG[o.backendStatus];
                if (!sc) return null;
                const Icon = sc.icon;
                return (
                  <Link key={o.id} href={`/trips/${o.id}`}>
                    <div
                      className="rounded-2xl p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200 mb-1"
                      style={{ background: "rgba(5,18,12,0.8)", border: "1px solid rgba(52,211,153,0.08)" }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-[13px] font-bold text-white">{o.trackingCode}</p>
                          <p className="text-[11px] text-slate-600">{fmtDate(o.createdAt)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-xl border ${sc.color} ${sc.bg} ${sc.border}`}>
                          <Icon size={10} /> {sc.label}
                        </span>
                      </div>

                      <div className="space-y-1 mb-3 text-[12px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-emerald-400 w-10 shrink-0">TỪ</span>
                          <span className="truncate">{o.originBranchName || "Chi nhánh gốc"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-sky-400 w-10 shrink-0">ĐẾN</span>
                          <span className="truncate">{o.destBranchName || o.receiverAddress.split(",")[0]}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between" style={{ borderTop: "1px solid rgba(52,211,153,0.06)", paddingTop: "0.75rem" }}>
                        <div className="text-[11px] text-slate-600">
                          {o.receiverName} · {o.receiverPhone}
                        </div>
                        <ChevronRight size={14} className="text-slate-600" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
      <BottomNav active="/trips" />
    </div>
  );
}
