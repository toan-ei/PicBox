"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home, Map, ArrowLeftRight, User,
  Bell, BellOff, ChevronRight, Package, Star,
  Shield, HelpCircle, LogOut, Loader, Truck,
} from "lucide-react";
import { getAuthState, clearAuthData, getMyOrders } from "@picbox/utils";

function BottomNav({ active }: { active: string }) {
  const NAV = [
    { href: "/", icon: Home, label: "Trang chủ" },
    { href: "/routes", icon: Map, label: "Tuyến đường" },
    { href: "/transfers", icon: ArrowLeftRight, label: "Chuyển hàng" },
    { href: "/profile", icon: User, label: "Tài khoản" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{ background: "rgba(2,15,10,0.97)", borderTop: "1px solid rgba(52,211,153,0.10)", backdropFilter: "blur(20px)" }}>
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

const MENU = [
  { icon: Package,    label: "Lịch sử vận chuyển",    href: "/history",  color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: Truck,      label: "Thông tin phương tiện",  href: "/vehicle",  color: "text-cyan-400",    bg: "bg-cyan-500/10" },
  { icon: Star,       label: "Đánh giá tài xế",        href: "/ratings",  color: "text-amber-400",   bg: "bg-amber-500/10" },
  { icon: Shield,     label: "Chính sách & điều khoản",href: "/policy",   color: "text-violet-400",  bg: "bg-violet-500/10" },
  { icon: HelpCircle, label: "Hỗ trợ",                 href: "/support",  color: "text-sky-400",     bg: "bg-sky-500/10" },
];

export default function DriverProfilePage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [totalTrips, setTotalTrips]       = useState(0);
  const [loading, setLoading]             = useState(true);

  const auth = getAuthState();
  const user = auth.user;
  const userName = user?.fullName || "Tài xế";
  const initials = userName.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    getMyOrders(0, 100)
      .then(page => setTotalTrips(page.orders.filter(o => o.status === "delivered").length))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    clearAuthData();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#020f0a]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-6 animate-fadeIn">
          <div
            className="h-20 w-20 rounded-2xl flex items-center justify-center text-[28px] font-bold text-white mb-3"
            style={{ background: "linear-gradient(135deg, #10b981, #34d399)", boxShadow: "0 8px 24px -4px rgba(16,185,129,0.4)" }}
          >
            {initials}
          </div>
          <h1 className="text-[20px] font-bold text-white">{userName}</h1>
          <p className="text-[13px] text-slate-500 mt-1">{user?.phone || user?.email || "Driver PicBox"}</p>
          <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-semibold text-emerald-400">Đang hoạt động</span>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader size={18} className="text-emerald-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 mb-5 animate-fadeIn">
            {[
              { label: "Chuyến hoàn thành", value: String(totalTrips), icon: Package, color: "#34d399" },
              { label: "Rating",            value: "4.9",              icon: Star,    color: "#fbbf24" },
              { label: "Tháng này",         value: "₫0",               icon: Truck,   color: "#38bdf8" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass-card p-3 text-center">
                  <Icon size={16} className="mx-auto mb-1.5" style={{ color: s.color }} />
                  <p className="text-[16px] font-bold text-white leading-none">{s.value}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Notification toggle */}
        <div className="glass-card p-4 mb-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                {notifications
                  ? <Bell size={15} className="text-emerald-400" />
                  : <BellOff size={15} className="text-slate-500" />
                }
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">Thông báo chuyến mới</p>
                <p className="text-[11px] text-slate-500">{notifications ? "Đang bật" : "Đã tắt"}</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Bật/tắt thông báo"
              onClick={() => setNotifications(v => !v)}
              className={`relative h-7 w-12 rounded-full transition-all duration-300 cursor-pointer ${notifications ? "bg-emerald-500" : "bg-slate-700"}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${notifications ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>

        {/* Menu */}
        <div className="glass-card divide-y divide-white/[0.04] mb-4 animate-fadeIn">
          {MENU.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-all cursor-pointer press-effect">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${item.bg}`}>
                    <Icon size={15} className={item.color} />
                  </div>
                  <span className="text-[13px] font-medium text-slate-300">{item.label}</span>
                </div>
                <ChevronRight size={14} className="text-slate-600" />
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-[13px] font-semibold cursor-pointer hover:bg-rose-500/15 transition-all press-effect animate-fadeIn"
        >
          <LogOut size={16} /> Đăng xuất
        </button>

        <p className="text-center text-[11px] text-slate-700 mt-4">PicBox Driver v1.0.0</p>
      </div>

      <BottomNav active="/profile" />
    </div>
  );
}
