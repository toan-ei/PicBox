"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, MapPin, BarChart3,
  Activity, Bell, Truck, QrCode, Map, Navigation,
  Users, CheckCircle, Clock, ArrowLeftRight, User
} from "lucide-react";

const NAV = [
  { href: "/", icon: LayoutDashboard, label: "Live Monitor" },
  { href: "/branch/dispatch", icon: Truck, label: "Bảng điều phối" },
  { href: "/branch/shipper-routes", icon: Map, label: "Theo dõi lộ trình" },
  { href: "/hub/sorting", icon: QrCode, label: "Sorting Station" },
  { href: "/orders", icon: Package, label: "Đơn hàng" },
  { href: "/hubs", icon: MapPin, label: "Hub" },
  { href: "/reports", icon: BarChart3, label: "Báo cáo" },
];

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0800] text-slate-200">
      {/* Sidebar */}
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
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
          {NAV.map((n) => {
            const Icon = n.icon;
            const isActive = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all relative ${
                  isActive ? "text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                }`}
                style={isActive ? { background: "linear-gradient(90deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)" } : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: "linear-gradient(180deg, #f59e0b, #fbbf24)", boxShadow: "0 0 8px rgba(251,191,36,0.5)" }} />
                )}
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

      {/* Main Content Area */}
      <div className="ops-main">
        <div className="p-6">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[11px] text-slate-500 font-medium">PicBox Decentralized Delivery System</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-600">14/05/2026 · 18:{String(30 + (tick % 12)).padStart(2, "0")}</span>
              <button className="h-9 w-9 rounded-xl glass flex items-center justify-center relative cursor-pointer hover:bg-white/[0.03] transition-colors">
                <Bell size={15} className="text-slate-400" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
              </button>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
