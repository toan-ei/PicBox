"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Package, Truck, MapPin,
  BarChart3, Bell, Settings, Shield, ChevronLeft, X, LogOut,
} from "lucide-react";

interface NavItem { label: string; href: string; icon: React.ElementType; badge?: string }
interface NavGroup { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Quản lý",
    items: [
      { label: "Người dùng",    href: "/users",    icon: Users },
      { label: "Đơn hàng",      href: "/orders",   icon: Package },
      { label: "Shipper",       href: "/shippers",  icon: Truck },
      { label: "Hub & Chi nhánh", href: "/hubs",   icon: MapPin },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { label: "Thống kê",   href: "/analytics",     icon: BarChart3 },
      { label: "Thông báo",  href: "/notifications", icon: Bell },
      { label: "Cấu hình",   href: "/system",        icon: Settings },
      { label: "Phân quyền", href: "/roles",          icon: Shield },
    ],
  },
];

export const SIDEBAR_W = 240;
export const SIDEBAR_W_COLLAPSED = 64;

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative group/tip">
      {children}
      <div
        className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
          rounded-lg px-2.5 py-1.5 text-xs font-medium text-white whitespace-nowrap
          opacity-0 scale-95 group-hover/tip:opacity-100 group-hover/tip:scale-100
          transition-all duration-150"
        style={{
          background: "rgba(15,23,42,0.95)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        {label}
        <span
          className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
          style={{ borderRightColor: "rgba(15,23,42,0.95)" }}
        />
      </div>
    </div>
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName] = useState(() => {
    if (typeof window === "undefined") return "Admin";
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.fullName || u.username || "Admin";
    } catch { return "Admin"; }
  });

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    document.cookie = "auth_token=;path=/;max-age=0";
    router.replace("/login");
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 z-50 flex flex-col rounded-r-2xl",
          "transition-all duration-300 ease-in-out",
          mobileOpen ? "translate-x-0 left-0" : "-translate-x-full lg:translate-x-0",
          "lg:left-4 lg:top-4 lg:bottom-4 lg:rounded-2xl",
        ].join(" ")}
      >
        <div
          className="flex flex-col h-full overflow-hidden rounded-[inherit]"
          style={{
            width: collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W,
            background: "rgba(6,9,28,0.97)",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "width 300ms ease-in-out",
          }}
        >
          {/* Logo */}
          <div
            className={["flex h-16 flex-shrink-0 items-center", collapsed ? "justify-center" : "justify-between px-4"].join(" ")}
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Link href="/" onClick={onMobileClose} className="flex items-center gap-2.5 min-w-0 select-none">
              <div
                className="flex flex-shrink-0 items-center justify-center rounded-xl h-9 w-9"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a855f7 100%)",
                  boxShadow: "0 4px 16px -4px rgba(139,92,246,0.5)",
                }}
              >
                <Package size={15} className="text-white" />
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <span
                    className="block text-[15px] font-bold leading-tight"
                    style={{ background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    PicBox
                  </span>
                  <span className="block text-[10px] text-slate-500 font-semibold tracking-widest uppercase">Admin Panel</span>
                </div>
              )}
            </Link>

            {!collapsed && (
              <>
                <button
                  type="button"
                  title="Thu gọn sidebar"
                  onClick={onToggle}
                  className="hidden lg:flex items-center justify-center h-6 w-6 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all cursor-pointer flex-shrink-0"
                >
                  <ChevronLeft size={13} />
                </button>
                <button
                  type="button"
                  title="Đóng menu"
                  onClick={onMobileClose}
                  className="lg:hidden flex items-center justify-center h-6 w-6 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  <X size={13} />
                </button>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2.5">
            {navGroups.map((group, gi) => (
              <div key={group.label} className={gi > 0 ? "mt-5" : ""}>
                {!collapsed ? (
                  <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 select-none">
                    {group.label}
                  </p>
                ) : (
                  <div className="mx-auto mb-2 h-px" style={{ width: 24, background: "rgba(255,255,255,0.06)" }} />
                )}

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    const linkEl = (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onMobileClose}
                        className={[
                          "relative flex items-center rounded-xl transition-all duration-150 select-none",
                          collapsed ? "h-10 w-10 mx-auto justify-center" : "gap-2.5 px-3 py-2",
                          isActive
                            ? "text-white"
                            : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]",
                        ].join(" ")}
                        style={isActive ? { background: "linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.06) 100%)" } : undefined}
                      >
                        {isActive && !collapsed && (
                          <span
                            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                            style={{ width: 3, height: 16, background: "linear-gradient(180deg, #818cf8 0%, #a78bfa 100%)", boxShadow: "0 0 8px rgba(129,140,248,0.5)" }}
                          />
                        )}
                        {isActive && collapsed && (
                          <span
                            className="absolute -right-0.5 top-0.5 h-1.5 w-1.5 rounded-full"
                            style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)", boxShadow: "0 0 6px rgba(129,140,248,0.7)" }}
                          />
                        )}
                        <Icon size={16} className={`flex-shrink-0 ${isActive ? "text-indigo-400" : ""}`} />
                        {!collapsed && (
                          <span className="flex-1 text-[13px] font-medium truncate">{item.label}</span>
                        )}
                      </Link>
                    );

                    return collapsed ? (
                      <Tooltip key={item.href} label={item.label}>{linkEl}</Tooltip>
                    ) : linkEl;
                  })}
                </div>
              </div>
            ))}

            {collapsed && (
              <div className="mt-4 flex justify-center">
                <Tooltip label="Mở rộng sidebar">
                  <button
                    type="button"
                    title="Mở rộng sidebar"
                    onClick={onToggle}
                    className="flex items-center justify-center h-9 w-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all cursor-pointer"
                  >
                    <ChevronLeft size={13} className="rotate-180" />
                  </button>
                </Tooltip>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="flex-shrink-0 px-2.5 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {collapsed ? (
              <div className="flex flex-col items-center gap-1.5">
                <Tooltip label={adminName}>
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                </Tooltip>
                <Tooltip label="Đăng xuất">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center h-9 w-9 rounded-xl cursor-pointer transition-colors"
                    style={{ background: "rgba(239,68,68,0.07)", color: "rgba(248,113,113,0.7)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.15)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.7)"; }}
                  >
                    <LogOut size={15} />
                  </button>
                </Tooltip>
              </div>
            ) : (
              <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div
                    className="h-9 w-9 flex-shrink-0 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-slate-200 leading-tight truncate">{adminName}</p>
                    <p className="text-[11px] text-slate-500 leading-tight">Super Admin</p>
                  </div>
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: "#34d399", boxShadow: "0 0 6px rgba(52,211,153,0.6)" }} />
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-1.5 h-8 rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
                  style={{ background: "rgba(239,68,68,0.07)", color: "rgba(248,113,113,0.75)", border: "1px solid rgba(239,68,68,0.10)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.14)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.75)"; }}
                >
                  <LogOut size={13} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
