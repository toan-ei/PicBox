"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, Truck, DollarSign, Star, MapPin, Bell,
  ChevronRight, Clock, CheckCircle, AlertCircle, Home, List, Wallet, User,
  Navigation, TrendingUp, Loader,
} from "lucide-react";
import { getAssignedOrders, getAuthState } from "@picbox/utils";
import type { Order } from "@picbox/types";

const NAV = [
  { href: "/", icon: Home, label: "Trang chủ" },
  { href: "/orders", icon: List, label: "Đơn hàng" },
  { href: "/earnings", icon: Wallet, label: "Thu nhập" },
  { href: "/profile", icon: User, label: "Tài khoản" },
];

function BottomNav({ active }: { active: string }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2"
      style={{
        background: "rgba(4,12,28,0.97)",
        borderTop: "1px solid rgba(56,189,248,0.10)",
        backdropFilter: "blur(20px)",
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
        paddingTop: "0.5rem",
      }}
    >
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${isActive ? "" : "opacity-50"}`}
          >
            <div className="relative">
              <Icon size={20} className={isActive ? "text-cyan-400" : "text-slate-500"} />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cyan-400"
                  style={{ boxShadow: "0 0 6px rgba(56,189,248,0.8)" }} />
              )}
            </div>
            <span className={`text-[10px] font-semibold ${isActive ? "text-cyan-400" : "text-slate-600"}`}>{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

function toDisplayStatus(status: string): "pending" | "picking" | "delivering" | "delivered" | "failed" {
  if (["pending", "confirmed"].includes(status)) return "pending";
  if (["picked_up", "in_transit", "at_hub", "sorting"].includes(status)) return "picking";
  if (status === "out_for_delivery") return "delivering";
  if (status === "delivered") return "delivered";
  return "failed";
}

export default function ShipperDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuthState();
  const userName = auth.user?.fullName || "Shipper";
  const initials = userName.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    getAssignedOrders(0, 100)
      .then(page => setOrders(page.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeOrder = orders.find(o =>
    ["out_for_delivery", "picked_up", "confirmed"].includes(o.status)
  );

  const todayOrders = orders.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.createdAt).toDateString() === today;
  });

  const deliveredOrders = orders.filter(o => o.status === "delivered");
  const todayIncome = todayOrders
    .filter(o => o.status === "delivered")
    .reduce((s, o) => s + o.shippingFee, 0);

  const recentDone = orders
    .filter(o => ["delivered", "failed"].includes(o.status))
    .slice(0, 3);

  function fmtTime(iso: string) {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }

  return (
    <div className="min-h-screen bg-[#020c18]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <div>
            <p className="text-[12px] text-slate-500">Xin chào,</p>
            <h1 className="text-[20px] font-bold text-white">{userName} 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative h-10 w-10 rounded-xl glass flex items-center justify-center press-effect cursor-pointer">
              <Bell size={16} className="text-slate-400" />
            </button>
            <button
              onClick={() => setIsOnline(v => !v)}
              className={`flex items-center gap-2 px-3.5 h-10 rounded-xl border text-[12px] font-semibold transition-all duration-300 cursor-pointer press-effect ${
                isOnline
                  ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
                  : "bg-slate-500/10 border-slate-500/15 text-slate-500"
              }`}
            >
              <span className={`h-2 w-2 rounded-full transition-all duration-300 ${isOnline ? "bg-emerald-400 animate-pulse-dot" : "bg-slate-600"}`} />
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader size={20} className="text-cyan-400 animate-spin" />
          </div>
        )}

        {/* Active delivery card */}
        {!loading && activeOrder && (
          <Link href={`/delivery/${activeOrder.id}`}>
            <div
              className="rounded-2xl p-5 mb-5 cursor-pointer hover:scale-[1.01] transition-all duration-300 animate-slideUp press-effect"
              style={{
                background: "linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(6,182,212,0.12) 100%)",
                border: "1px solid rgba(56,189,248,0.25)",
                boxShadow: "0 8px 32px -8px rgba(14,165,233,0.3)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-cyan-500/20 flex items-center justify-center animate-float">
                    <Truck size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-cyan-300/70 uppercase tracking-wider font-semibold">Đơn đang giao</p>
                    <p className="text-[14px] font-bold text-white">{activeOrder.trackingCode}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/25 px-2.5 py-1 rounded-lg font-semibold">
                  {activeOrder.status === "out_for_delivery" ? "Đang giao" : "Đang lấy hàng"}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold text-emerald-400">A</span>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-300">{activeOrder.senderAddress || activeOrder.senderName}</p>
                    <p className="text-[10px] text-slate-600">Điểm lấy hàng</p>
                  </div>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <div className="w-px h-4 bg-slate-700" />
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] font-bold text-cyan-400">B</span>
                  </div>
                  <div>
                    <p className="text-[12px] text-slate-300">{activeOrder.receiverAddress}</p>
                    <p className="text-[10px] text-slate-600">Điểm giao hàng</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(56,189,248,0.10)" }}>
                <div className="flex items-center gap-4">
                  {activeOrder.codAmount > 0 && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={12} className="text-emerald-400" />
                      <span className="text-[12px] font-semibold text-emerald-400">COD ₫{activeOrder.codAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <span className="text-[12px] text-slate-500">Cước ₫{activeOrder.shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-400">
                  <span className="text-[12px] font-semibold">Chi tiết</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-2 gap-3 mb-5 stagger">
            {[
              { label: "Hôm nay", value: `${todayOrders.length}`, unit: "đơn", icon: Package, color: "#38bdf8", bg: "rgba(56,189,248,0.10)" },
              { label: "Thu nhập", value: `₫${Math.round(todayIncome / 1000)}k`, unit: "hôm nay", icon: DollarSign, color: "#34d399", bg: "rgba(52,211,153,0.10)" },
              { label: "Rating", value: "4.8", unit: "/ 5.0", icon: Star, color: "#fbbf24", bg: "rgba(251,191,36,0.10)" },
              { label: "Tổng đơn", value: `${deliveredOrders.length}`, unit: "đã giao", icon: TrendingUp, color: "#a78bfa", bg: "rgba(167,139,250,0.10)" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass-card p-4 animate-fadeIn">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                      <Icon size={15} style={{ color: s.color }} />
                    </div>
                    <span className="text-[10px] text-slate-600">{s.unit}</span>
                  </div>
                  <p className="text-[22px] font-bold text-white leading-none">{s.value}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent orders */}
        {!loading && recentDone.length > 0 && (
          <div className="glass-card p-4 mb-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-white">Đơn gần đây</h3>
              <Link href="/orders" className="text-[11px] text-cyan-400 flex items-center gap-0.5 press-effect">
                Tất cả <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentDone.map((o) => (
                <Link key={o.id} href={`/delivery/${o.id}`}>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer press-effect">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${o.status === "delivered" ? "bg-emerald-500/15" : "bg-rose-500/15"}`}>
                        {o.status === "delivered"
                          ? <CheckCircle size={15} className="text-emerald-400" />
                          : <AlertCircle size={15} className="text-rose-400" />
                        }
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white">{o.receiverName}</p>
                        <p className="text-[10px] text-slate-600">{o.trackingCode} · {fmtTime(o.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[13px] font-semibold ${o.status === "delivered" ? "text-emerald-400" : "text-slate-600 line-through"}`}>
                        ₫{o.shippingFee.toLocaleString()}
                      </p>
                      <p className={`text-[9px] font-semibold ${o.status === "delivered" ? "text-emerald-500/60" : "text-rose-500/60"}`}>
                        {o.status === "delivered" ? "Thành công" : "Thất bại"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No active order */}
        {!loading && !activeOrder && orders.length === 0 && (
          <div className="glass-card p-6 text-center animate-fadeIn">
            <Package size={32} className="mx-auto mb-3 text-slate-700" />
            <p className="text-[14px] text-slate-500">Chưa có đơn nào được gán cho bạn</p>
            <p className="text-[12px] text-slate-600 mt-1">Liên hệ Ops Manager để nhận đơn mới</p>
          </div>
        )}

        {/* Area info */}
        <div className="glass-card p-4 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <MapPin size={14} className="text-cyan-400" />
            </div>
            <div>
              <span className="text-[13px] font-semibold text-white">Khu vực hoạt động</span>
              <p className="text-[11px] text-slate-500">TP.HCM</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-cyan-400" />
              <span className="text-[12px] text-slate-400">{orders.filter(o => ["confirmed", "pending"].includes(o.status)).length} đơn đang chờ lấy</span>
            </div>
            <button className="flex items-center gap-1 text-cyan-400 text-[12px] font-semibold cursor-pointer press-effect">
              <Navigation size={12} />
              Bản đồ
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="/" />
    </div>
  );
}
