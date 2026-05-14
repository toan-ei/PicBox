"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  Package,
  Truck,
  MapPin,
  BarChart3,
  Bell,
  Shield,
  HelpCircle,
} from "lucide-react";

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
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

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-[#0a0f1e]/95 backdrop-blur-2xl
          border-r border-white/[0.06]
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[68px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo area */}
        <div className={`flex items-center h-16 border-b border-white/[0.06] ${collapsed ? "justify-center px-2" : "justify-between px-4"}`}>
          <Link href="/" className="flex items-center gap-3 group" onClick={onMobileClose}>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <Package size={17} className="text-white" />
            </div>
            {!collapsed && (
              <div className="animate-fadeInLeft">
                <span className="text-[15px] font-bold gradient-text">PicBox</span>
                <span className="text-[10px] text-slate-500 block -mt-0.5 font-medium tracking-wider uppercase">Admin Panel</span>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={onToggle}
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-all cursor-pointer"
              title="Thu gọn sidebar"
            >
              <ChevronLeft size={15} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5">
          {collapsed ? (
            /* Collapsed: icons only */
            <div className="space-y-1">
              {navGroups.flatMap((g) => g.items).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={`
                      flex items-center justify-center h-10 w-10 mx-auto rounded-xl transition-all duration-200
                      ${isActive
                        ? "bg-indigo-500/15 text-indigo-400 shadow-sm shadow-indigo-500/10"
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
                      }
                    `}
                  >
                    {item.icon}
                  </Link>
                );
              })}
              {/* Expand button */}
              <button
                onClick={onToggle}
                className="flex items-center justify-center h-10 w-10 mx-auto rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all mt-4 cursor-pointer"
                title="Mở rộng sidebar"
              >
                <ChevronLeft size={15} className="rotate-180" />
              </button>
            </div>
          ) : (
            /* Expanded: full nav */
            <div className="space-y-6">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 mb-2 px-3">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onMobileClose}
                          className={`
                            group flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200
                            ${isActive
                              ? "bg-indigo-500/12 text-indigo-400"
                              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                            }
                          `}
                        >
                          <span className={`flex-shrink-0 transition-colors ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                            {item.icon}
                          </span>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${isActive ? "bg-indigo-500/20 text-indigo-300" : "bg-white/[0.05] text-slate-500"}`}>
                              {item.badge}
                            </span>
                          )}
                          {isActive && (
                            <div className="absolute left-0 w-[3px] h-5 rounded-r-full bg-indigo-500" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Bottom: Help */}
        {!collapsed && (
          <div className="p-3 border-t border-white/[0.06]">
            <div className="rounded-xl bg-gradient-to-r from-indigo-500/[0.08] to-purple-500/[0.08] p-3 border border-indigo-500/10">
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle size={14} className="text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-300">Cần hỗ trợ?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Liên hệ đội ngũ kỹ thuật PicBox để được hỗ trợ.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
