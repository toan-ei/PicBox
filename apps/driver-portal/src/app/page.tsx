"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck, Package, MapPin, Clock, CheckCircle, ChevronRight,
  Home, Map, ArrowLeftRight, User, AlertTriangle, Phone, Loader,
} from "lucide-react";
import { getInTransitOrders, getAuthState } from "@picbox/utils";
import type { AdminOrder } from "@picbox/utils";

function BottomNav({ active }: { active: string }) {
  const NAV = [
    { href: "/", icon: Home, label: "Tổng quan" },
    { href: "/routes", icon: Map, label: "Lộ trình" },
    { href: "/trips", icon: ArrowLeftRight, label: "Chuyến hàng" },
    { href: "/profile", icon: User, label: "Tài khoản" },
  ];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2"
      style={{
        background: "rgba(2,9,5,0.97)",
        borderTop: "1px solid rgba(52,211,153,0.10)",
        backdropFilter: "blur(20px)",
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
        paddingTop: "0.5rem",
      }}
    >
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200 ${isActive ? "" : "opacity-50"}`}>
            <div className="relative">
              <Icon size={20} className={isActive ? "text-emerald-400" : "text-slate-500"} />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-emerald-400"
                  style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }} />
              )}
            </div>
            <span className={`text-[10px] font-semibold ${isActive ? "text-emerald-400" : "text-slate-600"}`}>{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  AT_ORIGIN_BRANCH:          "Chờ lấy hàng",
  IN_TRANSIT_TO_HUB:         "Đang vận chuyển đến Hub",
  AT_HUB:                    "Tại Hub",
  IN_TRANSIT_TO_DEST_HUB:    "Hub → Hub",
  AT_DEST_HUB:               "Tại Hub đích",
  IN_TRANSIT_TO_DEST_BRANCH: "Đang vận chuyển đến CN",
  AT_DEST_BRANCH:            "Tại CN đích",
};

export default function DriverDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [sosModal, setSosModal] = useState(false);

  const auth = getAuthState();
  const userName = auth.user?.fullName || "Tài xế";

  useEffect(() => {
    getInTransitOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeOrders = orders.filter(o =>
    ["IN_TRANSIT_TO_HUB", "IN_TRANSIT_TO_DEST_HUB", "IN_TRANSIT_TO_DEST_BRANCH"].includes(o.backendStatus)
  );
  const waitingOrders = orders.filter(o =>
    ["AT_ORIGIN_BRANCH", "AT_HUB", "AT_DEST_HUB", "AT_DEST_BRANCH"].includes(o.backendStatus)
  );

  return (
    <div className="min-h-screen bg-[#020f0a]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #34d399 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <div>
            <p className="text-[12px] text-slate-500">Xin chào,</p>
            <h1 className="text-[20px] font-bold text-white">{userName} 🚚</h1>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-600" suppressHydrationWarning>
              {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" })}
            </p>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }} />
              <p className="text-[11px] text-emerald-400 font-semibold">Đang hoạt động</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={20} className="text-emerald-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Active trip card */}
            {activeOrders.length > 0 && (
              <Link href="/trips">
                <div
                  className="rounded-2xl p-5 mb-5 cursor-pointer hover:scale-[1.01] transition-all duration-300 animate-slideUp press-effect"
                  style={{
                    background: "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(52,211,153,0.10) 100%)",
                    border: "1px solid rgba(52,211,153,0.25)",
                    boxShadow: "0 8px 32px -8px rgba(16,185,129,0.3)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/20 flex items-center justify-center animate-float">
                        <Truck size={16} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-300/70 uppercase tracking-wider font-semibold">Đang vận chuyển</p>
                        <p className="text-[14px] font-bold text-white">{activeOrders.length} kiện hàng</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 px-2.5 py-1 rounded-lg font-semibold">
                      Đang di chuyển
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(52,211,153,0.10)" }}>
                    <span className="text-[12px] text-slate-400">{STATUS_LABEL[activeOrders[0].backendStatus]}</span>
                    <div className="flex items-center gap-1 text-emerald-400 text-[12px] font-semibold">
                      Xem chi tiết <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5 stagger">
              {[
                { label: "Đang vận chuyển", value: activeOrders.length,  icon: Truck,   color: "#34d399", bg: "rgba(52,211,153,0.10)" },
                { label: "Chờ xử lý",       value: waitingOrders.length, icon: Clock,   color: "#6ee7b7", bg: "rgba(110,231,183,0.10)" },
                { label: "Tổng hàng quản lý",value: orders.length,        icon: Package, color: "#a7f3d0", bg: "rgba(167,243,208,0.10)" },
                { label: "Tại Hub / CN",     value: waitingOrders.filter(o => ["AT_HUB","AT_DEST_HUB"].includes(o.backendStatus)).length, icon: MapPin, color: "#d1fae5", bg: "rgba(209,250,229,0.10)" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="glass-card p-4 animate-fadeIn">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                        <Icon size={14} style={{ color: s.color }} />
                      </div>
                    </div>
                    <p className="text-[22px] font-bold text-white leading-none">{s.value}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Waiting orders */}
            {waitingOrders.length > 0 && (
              <div className="glass-card p-4 mb-4 animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <MapPin size={15} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-white">Hàng đang chờ xử lý</h3>
                      <p className="text-[10px] text-slate-500">{waitingOrders.length} đơn tại Hub / Chi nhánh</p>
                    </div>
                  </div>
                  <Link href="/trips" className="text-[11px] text-emerald-400 flex items-center gap-0.5 press-effect">
                    Xem <ChevronRight size={12} />
                  </Link>
                </div>
                <div className="space-y-2">
                  {waitingOrders.slice(0, 3).map((o) => (
                    <Link key={o.id} href={`/trips/${o.id}`}>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer press-effect">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Package size={13} className="text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-[12px] font-semibold text-white">{o.trackingCode}</p>
                            <p className="text-[10px] text-slate-600">{STATUS_LABEL[o.backendStatus]}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-700" />
                      </div>
                    </Link>
                  ))}
                  {waitingOrders.length > 3 && (
                    <p className="text-[11px] text-slate-600 text-center pt-1">+{waitingOrders.length - 3} đơn khác</p>
                  )}
                </div>
              </div>
            )}

            {/* No orders */}
            {orders.length === 0 && (
              <div className="glass-card p-6 text-center animate-fadeIn mb-4">
                <Package size={32} className="mx-auto mb-3 text-slate-700" />
                <p className="text-[14px] text-slate-500">Không có hàng đang trung chuyển</p>
                <p className="text-[12px] text-slate-600 mt-1">Liên hệ Ops để nhận chuyến hàng mới</p>
              </div>
            )}

            {/* SOS Button */}
            <div className="glass-card p-4 animate-fadeIn" style={{ border: "1px solid rgba(239,68,68,0.10)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
                    <AlertTriangle size={15} className="text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-white">Báo sự cố</h3>
                    <p className="text-[10px] text-slate-500">Xe hỏng, tai nạn, mất hàng...</p>
                  </div>
                </div>
                <button
                  onClick={() => setSosModal(true)}
                  className="h-10 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] font-semibold cursor-pointer press-effect flex items-center gap-1.5"
                >
                  <Phone size={12} /> SOS
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav active="/" />

      {sosModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setSosModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-t-3xl p-6 animate-slideUp"
            style={{ background: "rgba(5,18,12,0.98)", border: "1px solid rgba(239,68,68,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto mb-5" />
            <h3 className="text-[16px] font-bold text-white mb-1">Báo sự cố khẩn cấp</h3>
            <p className="text-[12px] text-slate-500 mb-4">Chọn loại sự cố để thông báo cho trung tâm điều hành</p>
            <div className="space-y-2 mb-5">
              {[
                { label: "Xe hỏng / hư hại",       icon: "🚛" },
                { label: "Tai nạn giao thông",      icon: "🚨" },
                { label: "Seal bị phá / hàng mất",  icon: "📦" },
                { label: "Kẹt đường nghiêm trọng",  icon: "🚧" },
                { label: "Vấn đề khác",              icon: "❓" },
              ].map((r) => (
                <button key={r.label}
                  className="w-full text-left px-4 py-3.5 rounded-xl text-[13px] bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:bg-rose-500/[0.06] hover:border-rose-500/20 hover:text-rose-300 transition-all cursor-pointer press-effect flex items-center gap-3"
                  onClick={() => setSosModal(false)}
                >
                  <span className="text-[16px]">{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
            <button onClick={() => setSosModal(false)} className="w-full h-10 text-[13px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              Huỷ bỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
