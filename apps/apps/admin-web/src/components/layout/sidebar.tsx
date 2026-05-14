"use client";

import React from "react";
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
  ChevronRight,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
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
      { label: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    label: "Quản lý",
    items: [
      { label: "Người dùng", href: "/users", icon: <Users size={18} />, badge: "3.2k" },
      { label: "Đơn hàng", href: "/orders", icon: <Package size={18} /> },
      { label: "Shipper", href: "/shippers", icon: <Truck size={18} /> },
      { label: "Hub & Chi nhánh", href: "/hubs", icon: <MapPin size={18} /> },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { label: "Thống kê", href: "/analytics", icon: <BarChart3 size={18} /> },
      { label: "Thông báo", href: "/notifications", icon: <Bell size={18} /> },
      { label: "Cấu hình", href: "/system", icon: <Settings size={18} /> },
      { label: "Phân quyền", href: "/roles", icon: <Shield size={18} /> },
    ],
  },
];

export const SIDEBAR_W = 256;
export const SIDEBAR_W_COLLAPSED = 72;

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
        style={{ width: collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W }}
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          "bg-[#070d1f] border-r border-white/[0.06]",
          "transition-all duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* ── Logo ── */}
        <div
          className={[
            "flex h-16 flex-shrink-0 items-center border-b border-white/[0.06]",
            collapsed ? "justify-center px-3" : "justify-between px-4",
          ].join(" ")}
        >
          <Link
            href="/"
            onClick={onMobileClose}
            className="flex items-center gap-3 min-w-0"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-indigo-500/25">
              <Package size={17} className="text-white" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden animate-fadeInLeft">
                <span className="block text-[15px] font-bold gradient-text leading-tight">
                  PicBox
                </span>
                <span className="block text-[10px] text-slate-500 font-semibold tracking-widest uppercase leading-tight">
                  Admin Panel
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          {!collapsed && (
            <button
              onClick={onMobileClose}
              className="lg:hidden flex items-center justify-center h-7 w-7 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 select-none">
                  {group.label}
                </p>
              )}
              {collapsed && (
                <div className="my-2 mx-auto h-px w-8 bg-white/[0.05]" />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      title={collapsed ? item.label : undefined}
                      className={[
                        "relative flex items-center rounded-xl transition-all duration-200",
                        collapsed
                          ? "h-10 w-10 mx-auto justify-center"
                          : "gap-3 px-3 py-2.5",
                        isActive
                          ? "bg-indigo-500/[0.12] text-indigo-400"
                          : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]",
                      ].join(" ")}
                    >
                      {/* Active left bar — only in expanded mode */}
                      {isActive && !collapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500" />
                      )}

                      {/* Active dot — only in collapsed mode */}
                      {isActive && collapsed && (
                        <span className="absolute -right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      )}

                      <span className="flex-shrink-0">{item.icon}</span>

                      {!collapsed && (
                        <>
                          <span className="flex-1 text-[13px] font-medium truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={[
                                "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                                isActive
                                  ? "bg-indigo-500/20 text-indigo-300"
                                  : "bg-white/[0.06] text-slate-500",
                              ].join(" ")}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Bottom: toggle ── */}
        <div className="flex-shrink-0 border-t border-white/[0.06] px-3 py-3">
          <button
            onClick={onToggle}
            className={[
              "hidden lg:flex items-center justify-center h-8 rounded-xl",
              "text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]",
              "transition-all duration-200 cursor-pointer",
              collapsed ? "w-8 mx-auto" : "w-full gap-2",
            ].join(" ")}
            title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            <ChevronRight
              size={15}
              className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
            />
            {!collapsed && (
              <span className="text-[12px] font-medium">Thu gọn</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
