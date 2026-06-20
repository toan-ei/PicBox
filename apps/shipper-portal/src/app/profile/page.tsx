"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User, Phone, Mail, MapPin, Star, Package, Clock,
  Bell, Shield, ChevronRight, LogOut, Camera,
  Home, List, Wallet, TrendingUp, Edit3, Lock, HelpCircle,
} from "lucide-react";

function BottomNav({ active }: { active: string }) {
  const NAV = [
    { href: "/", icon: Home, label: "Trang chủ" },
    { href: "/orders", icon: List, label: "Đơn hàng" },
    { href: "/earnings", icon: Wallet, label: "Thu nhập" },
    { href: "/profile", icon: User, label: "Tài khoản" },
  ];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{ background: "rgba(4,12,28,0.97)", borderTop: "1px solid rgba(56,189,248,0.10)", backdropFilter: "blur(20px)" }}
    >
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${isActive ? "" : "opacity-50"}`}>
            <Icon size={20} className={isActive ? "text-cyan-400" : "text-slate-500"} />
            <span className={`text-[10px] font-semibold ${isActive ? "text-cyan-400" : "text-slate-600"}`}>{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

const PROFILE = {
  name: "Ngô Văn Tùng",
  phone: "0923 456 789",
  email: "tung.ngo@shipper.picbox.vn",
  area: "Bình Thạnh, TP.HCM",
  joinDate: "15/01/2025",
  vehicleType: "Xe máy",
  plate: "59B1-23456",
};

const STATS = [
  { label: "Tổng đơn", value: "1,247", icon: Package, color: "#38bdf8", bg: "rgba(56,189,248,0.10)" },
  { label: "Đánh giá", value: "4.8", icon: Star, color: "#fbbf24", bg: "rgba(251,191,36,0.10)" },
  { label: "Đúng giờ", value: "96%", icon: Clock, color: "#34d399", bg: "rgba(52,211,153,0.10)" },
  { label: "Thu nhập tháng", value: "₫8.5M", icon: TrendingUp, color: "#a78bfa", bg: "rgba(167,139,250,0.10)" },
];

const MENU_ITEMS = [
  { label: "Chỉnh sửa hồ sơ", icon: Edit3, href: "#" },
  { label: "Đổi mật khẩu", icon: Lock, href: "#" },
  { label: "Cài đặt thông báo", icon: Bell, href: "#" },
  { label: "Bảo mật & Quyền riêng tư", icon: Shield, href: "#" },
  { label: "Trung tâm hỗ trợ", icon: HelpCircle, href: "#" },
];

export default function ShipperProfilePage() {
  const [notifEnabled, setNotifEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-[#020c18]">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="mb-6 animate-fadeIn">
          <h1 className="text-[20px] font-bold text-white">Tài khoản</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Quản lý thông tin cá nhân của bạn</p>
        </div>

        {/* Profile card */}
        <div
          className="rounded-2xl p-5 mb-5 animate-slideUp"
          style={{
            background: "linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(6,182,212,0.12) 100%)",
            border: "1px solid rgba(56,189,248,0.25)",
            boxShadow: "0 8px 32px -8px rgba(14,165,233,0.3)",
          }}
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center text-[22px] font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                  boxShadow: "0 4px 20px -4px rgba(14,165,233,0.5)",
                }}
              >
                NT
              </div>
              <button
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-cyan-500 flex items-center justify-center border-2 border-[#020c18] cursor-pointer"
                style={{ boxShadow: "0 2px 8px rgba(6,182,212,0.4)" }}
              >
                <Camera size={12} className="text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-bold text-white">{PROFILE.name}</h2>
              <p className="text-[12px] text-cyan-300/60 mt-0.5">Shipper · Từ {PROFILE.joinDate}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="text-amber-400" />
                <span className="text-[12px] text-amber-400 font-semibold">4.8</span>
                <span className="text-[10px] text-slate-500">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5 stagger">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-card p-4 animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                    <Icon size={15} style={{ color: s.color }} />
                  </div>
                </div>
                <p className="text-[22px] font-bold text-white leading-none">{s.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Contact info */}
        <div className="glass-card p-4 mb-4 animate-fadeIn">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Thông tin liên hệ</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Phone size={14} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Số điện thoại</p>
                <p className="text-[13px] font-medium text-white">{PROFILE.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Email</p>
                <p className="text-[13px] font-medium text-white">{PROFILE.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={14} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Khu vực hoạt động</p>
                <p className="text-[13px] font-medium text-white">{PROFILE.area}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle info */}
        <div className="glass-card p-4 mb-4 animate-fadeIn">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Phương tiện</p>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2.5">
              <span className="text-[18px]">🏍️</span>
              <div>
                <p className="text-[13px] font-semibold text-white">{PROFILE.vehicleType}</p>
                <p className="text-[11px] text-slate-500 font-mono">{PROFILE.plate}</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg font-semibold">
              Đã xác minh
            </span>
          </div>
        </div>

        {/* Notification toggle */}
        <div className="glass-card p-4 mb-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Bell size={14} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">Thông báo đẩy</p>
                <p className="text-[11px] text-slate-500">Nhận đơn mới & cập nhật</p>
              </div>
            </div>
            <button
              onClick={() => setNotifEnabled((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${notifEnabled ? "bg-cyan-500" : "bg-slate-700"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${notifEnabled ? "left-[22px]" : "left-0.5"}`}
              />
            </button>
          </div>
        </div>

        {/* Menu items */}
        <div className="glass-card overflow-hidden mb-4 animate-fadeIn">
          {MENU_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                style={i > 0 ? { borderTop: "1px solid rgba(255,255,255,0.04)" } : undefined}
              >
                <Icon size={16} className="text-slate-500 flex-shrink-0" />
                <span className="flex-1 text-[13px] text-slate-300">{item.label}</span>
                <ChevronRight size={14} className="text-slate-700" />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-semibold cursor-pointer transition-all press-effect animate-fadeIn"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.15)",
            color: "rgba(248,113,113,0.85)",
          }}
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>

      <BottomNav active="/profile" />
    </div>
  );
}
