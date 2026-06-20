"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, MapPin, BarChart3,
  Activity, Bell, Truck, QrCode, Map,
  Users, Menu, X, LogOut, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/", icon: LayoutDashboard, label: "Live Monitor", badge: "" },
  { href: "/branch/dispatch", icon: Truck, label: "Bảng điều phối", badge: "" },
  { href: "/branch/shipper-routes", icon: Map, label: "Theo dõi lộ trình", badge: "" },
  { href: "/hub/sorting", icon: QrCode, label: "Sorting Station", badge: "" },
  { href: "/orders", icon: Package, label: "Đơn hàng", badge: "12" },
  { href: "/hubs", icon: MapPin, label: "Hub & Chi nhánh", badge: "" },
  { href: "/reports", icon: BarChart3, label: "Báo cáo", badge: "" },
];

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [tick, setTick] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 5000);
    return () => clearInterval(t);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#0c0800] text-slate-200">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? "active" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <div className={`ops-sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(251,191,36,0.08)" }}>
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                boxShadow: "0 4px 16px -4px rgba(245,158,11,0.5)"
              }}>
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-white leading-tight">PicBox Ops</p>
              <p className="text-[10px] text-amber-500/60 font-semibold uppercase tracking-wider leading-tight">Control Center</p>
            </div>
          </Link>

          {/* Close button (mobile) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden flex items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
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
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative select-none ${
                  isActive
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                }`}
                style={isActive
                  ? { background: "linear-gradient(90deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)" }
                  : undefined
                }
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: "linear-gradient(180deg, #f59e0b, #fbbf24)", boxShadow: "0 0 8px rgba(251,191,36,0.5)" }} />
                )}
                <Icon size={16} className={isActive ? "text-amber-400" : ""} />
                <span className="flex-1">{n.label}</span>
                {n.badge && (
                  <span className="text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                    {n.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-2.5 pb-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(251,191,36,0.06)" }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.02] mt-4">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", boxShadow: "0 2px 10px rgba(245,158,11,0.3)" }}>
              O
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white leading-tight truncate">Ops Manager</p>
              <p className="text-[10px] text-slate-500 leading-tight truncate">ops01@picbox.vn</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"
              style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }} />
          </div>
          <button className="mt-2 w-full flex items-center justify-center gap-2 h-9 rounded-lg text-[12px] font-medium text-rose-400/70 hover:text-rose-400 bg-rose-500/[0.05] hover:bg-rose-500/[0.10] border border-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer">
            <LogOut size={13} />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ops-main">
        <div className="p-4 lg:p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6 animate-fadeIn">
            {/* Left: hamburger + info */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl glass text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <Menu size={18} />
              </button>
              <div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">PicBox Decentralized Delivery System</p>
                <p className="text-[11px] text-slate-500 font-medium sm:hidden">PicBox Ops</p>
              </div>
            </div>

            {/* Right: time + notification */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[11px] text-slate-600 hidden sm:inline" suppressHydrationWarning>
                {new Date().toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}
                {" · "}
                {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <button className="h-10 w-10 rounded-xl glass flex items-center justify-center relative cursor-pointer hover:bg-white/[0.03] transition-colors">
                <Bell size={15} className="text-slate-400" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-400 animate-pulse-dot" />
              </button>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
