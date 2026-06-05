"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  MapPin,
  BarChart3,
  Bell,
  Settings,
  Shield,
  ChevronLeft,
  X,
  LogOut,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Nav data
───────────────────────────────────────────── */
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Quản lý",
    items: [
      { label: "Người dùng", href: "/users", icon: Users, badge: "3.2k" },
      { label: "Đơn hàng", href: "/orders", icon: Package },
      { label: "Shipper", href: "/shippers", icon: Truck },
      { label: "Hub & Chi nhánh", href: "/hubs", icon: MapPin },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { label: "Thống kê", href: "/analytics", icon: BarChart3 },
      { label: "Thông báo", href: "/notifications", icon: Bell },
      { label: "Cấu hình", href: "/system", icon: Settings },
      { label: "Phân quyền", href: "/roles", icon: Shield },
    ],
  },
];

/* ─────────────────────────────────────────────
   Constants (must match globals.css offsets)
───────────────────────────────────────────── */
export const SIDEBAR_W = 260;
export const SIDEBAR_W_COLLAPSED = 72;

/* ─────────────────────────────────────────────
   Tooltip wrapper (only shown when collapsed)
───────────────────────────────────────────── */
function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative group/tip">
      {children}
      <div
        className={[
          "pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50",
          "flex items-center gap-1",
          "rounded-lg px-3 py-2",
          "text-[16px] font-medium text-white whitespace-nowrap",
          "opacity-0 scale-95 group-hover/tip:opacity-100 group-hover/tip:scale-100",
          "transition-all duration-150 ease-out",
        ].join(" ")}
        style={{
          background: "rgba(15,23,42,0.95)",
          border: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        {label}
        {/* Arrow */}
        <span
          className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
          style={{ borderRightColor: "rgba(15,23,42,0.95)" }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Sidebar
───────────────────────────────────────────── */
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
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
        {/* Inner wrapper with correct background */}
        <div
          className="flex flex-col h-full overflow-hidden rounded-[inherit]"
          style={{
            width: collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W,
            background: "rgba(6,9,28,0.97)",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "width 300ms ease-in-out",
          }}
        >
          {/* ── Logo ── */}
          <div
            className={[
              "flex h-[72px] flex-shrink-0 items-center",
              collapsed ? "justify-center" : "justify-between px-5",
            ].join(" ")}
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Link
              href="/"
              onClick={onMobileClose}
              className="flex items-center gap-2 min-w-0 select-none"
            >
              <div
                className="flex flex-shrink-0 items-center justify-center rounded-xl h-11 w-11"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a855f7 100%)",
                  boxShadow: "0 4px 20px -4px rgba(139,92,246,0.5)",
                }}
              >
                <Package size={17} className="text-white" />
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <span
                    className="block text-[19px] font-bold leading-tight"
                    style={{
                      background: "linear-gradient(135deg, #818cf8, #c084fc)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    PicBox
                  </span>
                  <span className="block text-[14px] text-slate-500 font-semibold tracking-widest uppercase leading-tight">
                    Admin Panel
                  </span>
                </div>
              )}
            </Link>

            {/* Collapse button (desktop) / Close (mobile) */}
            {!collapsed && (
              <>
                <button
                  onClick={onToggle}
                  className="hidden lg:flex items-center justify-center h-7 w-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all cursor-pointer flex-shrink-0"
                  title="Thu gọn sidebar"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={onMobileClose}
                  className="lg:hidden flex items-center justify-center h-7 w-7 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer flex-shrink-0"
                >
                  <X size={15} />
                </button>
              </>
            )}
          </div>

          {/* ── Navigation ── */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-5 px-3">
            {navGroups.map((group, gi) => (
              <div key={group.label} className={gi > 0 ? "mt-7" : ""}>
                {/* Group label */}
                {!collapsed ? (
                  <p className="mb-2 px-3 text-[14px] font-bold uppercase tracking-[0.14em] text-slate-600 select-none">
                    {group.label}
                  </p>
                ) : (
                  <div
                    className="mx-auto mb-3 h-px"
                    style={{
                      width: 28,
                      background: "rgba(255,255,255,0.06)",
                    }}
                  />
                )}

                {/* Items */}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    const linkContent = (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onMobileClose}
                        className={[
                          "relative flex items-center rounded-xl transition-all duration-200 select-none",
                          collapsed
                            ? "h-11 w-11 mx-auto flex items-center justify-center"
                            : "gap-3 px-4 py-3",
                          isActive
                            ? "text-white"
                            : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]",
                        ].join(" ")}
                        style={
                          isActive
                            ? {
                                background:
                                  "linear-gradient(90deg, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0.06) 100%)",
                              }
                            : undefined
                        }
                      >
                        {/* Active left gradient bar */}
                        {isActive && !collapsed && (
                          <span
                            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                            style={{
                              width: 3,
                              height: 20,
                              background:
                                "linear-gradient(180deg, #818cf8 0%, #a78bfa 100%)",
                              boxShadow: "0 0 8px rgba(129,140,248,0.6)",
                            }}
                          />
                        )}

                        {/* Active dot (collapsed) */}
                        {isActive && collapsed && (
                          <span
                            className="absolute -right-0.5 top-0.5 h-2 w-2 rounded-full"
                            style={{
                              background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                              boxShadow: "0 0 6px rgba(129,140,248,0.7)",
                            }}
                          />
                        )}

                        <Icon
                          size={22}
                          className={`flex-shrink-0 transition-colors duration-200 ${
                            isActive ? "text-indigo-400" : ""
                          }`}
                        />

                        {!collapsed && (
                          <>
                            <span className="flex-1 text-[17px] font-medium truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span
                                className="text-[14px] font-semibold px-2 py-1 rounded-md flex-shrink-0"
                                style={
                                  isActive
                                    ? {
                                        background: "rgba(99,102,241,0.2)",
                                        color: "#a5b4fc",
                                      }
                                    : {
                                        background: "rgba(255,255,255,0.06)",
                                        color: "#64748b",
                                      }
                                }
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    );

                    return collapsed ? (
                      <Tooltip key={item.href} label={item.label}>
                        {linkContent}
                      </Tooltip>
                    ) : (
                      linkContent
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Collapse button in collapsed mode */}
            {collapsed && (
              <div className="mt-6 flex justify-center">
                <Tooltip label="Mở rộng sidebar">
                  <button
                    onClick={onToggle}
                    className="flex items-center justify-center h-10 w-10 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all cursor-pointer"
                  >
                    <ChevronLeft size={15} className="rotate-180" />
                  </button>
                </Tooltip>
              </div>
            )}
          </nav>

          {/* ── Footer: Admin info + Logout ── */}
          <div
            className="flex-shrink-0 px-2.5 py-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {collapsed ? (
              /* Collapsed: avatar only + logout */
              <div className="flex flex-col items-center gap-2">
                <Tooltip label="Admin · Super Admin">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center text-base font-bold text-white cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      boxShadow: "0 2px 10px rgba(99,102,241,0.3)",
                    }}
                  >
                    A
                  </div>
                </Tooltip>
                <Tooltip label="Đăng xuất">
                  <button
                    className="flex items-center justify-center h-11 w-11 rounded-xl transition-all duration-200 cursor-pointer"
                    style={{
                      background: "rgba(239,68,68,0.07)",
                      color: "rgba(248,113,113,0.7)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(239,68,68,0.15)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(239,68,68,0.07)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "rgba(248,113,113,0.7)";
                    }}
                  >
                    <LogOut size={19} />
                  </button>
                </Tooltip>
              </div>
            ) : (
              /* Expanded: full admin card */
              <div
                className="rounded-xl p-3"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {/* Avatar */}
                  <div
                    className="h-11 w-11 flex-shrink-0 rounded-xl flex items-center justify-center text-lg font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      boxShadow: "0 2px 10px rgba(99,102,241,0.3)",
                    }}
                  >
                    A
                  </div>
                  {/* Name & Role */}
                  <div className="min-w-0">
                    <p className="text-[17px] font-semibold text-slate-200 leading-tight truncate">
                      Admin
                    </p>
                    <p className="text-[15px] mt-0.5 text-slate-500 leading-tight truncate">
                      Super Admin
                    </p>
                  </div>
                  {/* Online dot */}
                  <div className="flex-shrink-0 ml-auto">
                    <span
                      className="block h-2 w-2 rounded-full"
                      style={{
                        background: "#34d399",
                        boxShadow: "0 0 6px rgba(52,211,153,0.6)",
                      }}
                    />
                  </div>
                </div>

                {/* Logout button */}
                <button
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-[16px] font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    background: "rgba(239,68,68,0.07)",
                    color: "rgba(248,113,113,0.75)",
                    border: "1px solid rgba(239,68,68,0.10)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(239,68,68,0.14)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(239,68,68,0.22)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(239,68,68,0.07)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(248,113,113,0.75)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(239,68,68,0.10)";
                  }}
                >
                  <LogOut size={17} />
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
