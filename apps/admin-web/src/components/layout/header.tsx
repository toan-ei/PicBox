"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
} from "lucide-react";

// Map route to page title
const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/users": "Quản lý người dùng",
  "/orders": "Quản lý đơn hàng",
  "/shippers": "Quản lý Shipper",
  "/hubs": "Hub & Chi nhánh",
  "/analytics": "Thống kê",
  "/notifications": "Thông báo",
  "/system": "Cấu hình hệ thống",
  "/roles": "Phân quyền",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = pageTitles[pathname] || "Dashboard";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/[0.06] bg-[#050a18]/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
        >
          <Menu size={18} />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-[19px] font-semibold text-white">{pageTitle}</h1>
          <p className="text-[15px] text-slate-500 mt-0.5" suppressHydrationWarning>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Center: Search */}
      <div className={`hidden md:flex items-center flex-1 max-w-md mx-4 relative transition-all duration-200 ${searchFocused ? "max-w-lg" : ""}`}>
        <Search size={19} className="absolute left-3 text-slate-500" />
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng, người dùng..."
          className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] pl-11 pr-4 text-base text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-indigo-500/20"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="absolute right-3 hidden lg:inline-flex items-center gap-0.5 text-[14px] text-slate-600 bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 font-mono">
          ⌘K
        </kbd>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification */}
        <button className="relative flex items-center justify-center h-11 w-11 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer">
          <Bell size={21} />
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-[#050a18] animate-pulse-dot" />
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-white/[0.06] mx-1" />

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            <div className="h-10 w-10 rounded-lg gradient-brand flex items-center justify-center text-[15px] font-bold text-white shadow-md shadow-indigo-500/20">
              A
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[17px] font-medium text-slate-200 leading-tight">Admin</p>
              <p className="text-[15px] text-slate-500 leading-tight">Super Admin</p>
            </div>
            <ChevronDown
              size={14}
              className={`hidden sm:block text-slate-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/[0.08] bg-[#0c1225]/95 backdrop-blur-xl shadow-2xl shadow-black/40 py-2 animate-slideDown">
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <p className="text-base font-medium text-white">Admin</p>
                <p className="text-sm text-slate-500">admin@picbox.vn</p>
              </div>
              <div className="py-1.5">
                {[
                  { icon: <User size={14} />, label: "Hồ sơ cá nhân", href: "/profile"},
                  { icon: <Settings size={14} />, label: "Cài đặt", href: "/settings" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[16px] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-1.5">
                <a
                  href="/login"
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-[16px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.06] transition-colors cursor-pointer"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
