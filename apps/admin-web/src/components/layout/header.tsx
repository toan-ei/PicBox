"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, Bell, Search, ChevronDown, LogOut, User, Settings,
  Package, CheckCircle, X, Info, Loader, RefreshCw,
} from "lucide-react";
import { getUserNotifications } from "@picbox/utils";
import type { NotificationItem } from "@picbox/utils";

const pageTitles: Record<string, string> = {
  "/":              "Dashboard",
  "/users":         "Quản lý người dùng",
  "/orders":        "Quản lý đơn hàng",
  "/shippers":      "Quản lý Shipper",
  "/hubs":          "Hub & Chi nhánh",
  "/analytics":     "Thống kê",
  "/notifications": "Thông báo",
  "/system":        "Cấu hình hệ thống",
  "/roles":         "Phân quyền",
};

const NOTIF_CFG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  ORDER_CREATED:        { icon: Package,     color: "text-sky-400",     bg: "bg-sky-500/10" },
  ORDER_STATUS_CHANGED: { icon: Bell,        color: "text-indigo-400",  bg: "bg-indigo-500/10" },
  ORDER_CANCELLED:      { icon: X,           color: "text-rose-400",    bg: "bg-rose-500/10" },
  PAYMENT_SUCCESS:      { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  GENERIC:              { icon: Info,        color: "text-slate-400",   bg: "bg-slate-500/10" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

function getAdminId(): string {
  if (typeof window === "undefined") return "";
  try { return JSON.parse(localStorage.getItem("user") ?? "{}").id ?? ""; }
  catch { return ""; }
}

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [query, setQuery]           = useState("");
  const [dropdownOpen, setDropdown] = useState(false);
  const [bellOpen, setBellOpen]     = useState(false);
  const [notifs, setNotifs]         = useState<NotificationItem[]>([]);
  const [nLoading, setNLoading]     = useState(false);
  const [nLoaded, setNLoaded]       = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef     = useRef<HTMLDivElement>(null);
  const pageTitle   = pageTitles[pathname] || "Dashboard";

  const adminName = (() => {
    if (typeof window === "undefined") return "Admin";
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.fullName || u.username || "Admin";
    } catch { return "Admin"; }
  })();

  const fetchNotifs = useCallback(async () => {
    const id = getAdminId();
    if (!id) return;
    setNLoading(true);
    const data = await getUserNotifications(id);
    setNotifs(data);
    setNLoading(false);
    setNLoaded(true);
  }, []);

  // Load notifications when bell opens for the first time
  useEffect(() => {
    if (bellOpen && !nLoaded) fetchNotifs();
  }, [bellOpen, nLoaded, fetchNotifs]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/orders?q=${encodeURIComponent(q)}`);
    setQuery("");
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    document.cookie = "auth_token=;path=/;max-age=0";
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-white/[0.06] bg-[#050a18]/80 backdrop-blur-xl px-4 lg:px-5">
      {/* Left — hamburger + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          title="Mở menu"
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center h-8 w-8 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer flex-shrink-0"
        >
          <Menu size={16} />
        </button>
        <div className="hidden sm:block min-w-0">
          <h1 className="text-[14px] font-semibold text-white leading-snug truncate">{pageTitle}</h1>
          <p className="text-[11px] text-slate-500 leading-snug" suppressHydrationWarning>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Center — search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs mx-4 relative">
        <button
          type="submit"
          title="Tìm kiếm"
          className="absolute left-0 h-full w-9 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <Search size={14} />
        </button>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm đơn hàng, người dùng..."
          className="w-full h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] pl-9 pr-3 text-[13px] text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.06] font-sans"
        />
      </form>

      {/* Right — bell + user */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Bell dropdown */}
        <div ref={bellRef} className="relative">
          <button
            type="button"
            title="Thông báo"
            onClick={() => setBellOpen(v => !v)}
            className="relative flex items-center justify-center h-9 w-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <Bell size={16} />
            {notifs.length > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#050a18]" />
            )}
            {!nLoaded && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#050a18]" />
            )}
          </button>

          {bellOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/[0.08] shadow-2xl z-50 overflow-hidden bg-[#0a0e23]/[0.97] backdrop-blur-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Bell size={13} className="text-indigo-400" />
                  <span className="text-[13px] font-semibold text-white">Thông báo</span>
                  {notifs.length > 0 && (
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-md font-semibold">
                      {notifs.length}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  title="Tải lại"
                  onClick={(e) => { e.stopPropagation(); fetchNotifs(); }}
                  className="text-slate-600 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} className={nLoading ? "animate-spin" : ""} />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-80 overflow-y-auto">
                {nLoading ? (
                  <div className="flex items-center justify-center py-8 gap-2">
                    <Loader size={14} className="text-indigo-400 animate-spin" />
                    <span className="text-[12px] text-slate-500">Đang tải...</span>
                  </div>
                ) : notifs.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell size={24} className="text-slate-700 mx-auto mb-2" />
                    <p className="text-[12px] text-slate-600">Chưa có thông báo nào</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {notifs.slice(0, 10).map(n => {
                      const cfg = NOTIF_CFG[n.type] ?? NOTIF_CFG.GENERIC;
                      const Icon = cfg.icon;
                      return (
                        <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                            <Icon size={13} className={cfg.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-slate-200 leading-snug truncate">{n.subject}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{n.body}</p>
                            <p className="text-[10px] text-slate-700 mt-1">{formatDate(n.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/[0.06] px-4 py-2.5">
                <a
                  href="/notifications"
                  onClick={() => setBellOpen(false)}
                  className="text-[12px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Xem tất cả thông báo →
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:block w-px h-5 bg-white/[0.06] mx-1" />

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdown(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <div className="h-8 w-8 rounded-lg gradient-brand flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-[13px] font-medium text-slate-200 leading-tight truncate max-w-[100px]">{adminName}</p>
              <p className="text-[11px] text-slate-500 leading-tight">Super Admin</p>
            </div>
            <ChevronDown
              size={12}
              className={`hidden sm:block text-slate-500 transition-transform duration-200 flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/[0.08] bg-[#0c1225]/95 backdrop-blur-xl shadow-2xl py-1.5 z-50">
              <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                <p className="text-[13px] font-medium text-white truncate">{adminName}</p>
                <p className="text-[11px] text-slate-500">admin@picbox.vn</p>
              </div>
              {[
                { icon: <User size={13} />,     label: "Hồ sơ cá nhân", href: "/profile" },
                { icon: <Settings size={13} />, label: "Cài đặt",       href: "/settings" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
              <div className="border-t border-white/[0.06] mt-1 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.06] transition-colors cursor-pointer"
                >
                  <LogOut size={13} />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
