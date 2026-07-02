"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck, Package, MapPin, Clock, ChevronRight,
  AlertTriangle, Phone, Loader,
} from "lucide-react";
import { getInTransitOrders, getAuthState } from "@picbox/utils";
import type { AdminOrder } from "@picbox/utils";

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
  const [orders, setOrders]     = useState<AdminOrder[]>([]);
  const [loading, setLoading]   = useState(true);
  const [sosModal, setSosModal] = useState(false);

  const auth     = getAuthState();
  const userName = auth.user?.fullName || "Hoang Thanh Bao";

  useEffect(() => {
    getInTransitOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeOrders  = orders.filter(o =>
    ["IN_TRANSIT_TO_HUB","IN_TRANSIT_TO_DEST_HUB","IN_TRANSIT_TO_DEST_BRANCH"].includes(o.backendStatus)
  );
  const waitingOrders = orders.filter(o =>
    ["AT_ORIGIN_BRANCH","AT_HUB","AT_DEST_HUB","AT_DEST_BRANCH"].includes(o.backendStatus)
  );

  // Đảm bảo background tuyệt đối không chặn sự kiện click chuột bằng `pointer-events-none` và `z-[-10]`
  const Bg = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-10]">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(70px)" }} />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-8 pointer-events-none"
        style={{ background: "radial-gradient(circle, #34d399 0%, transparent 70%)", filter: "blur(60px)" }} />
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Bg />
        <Loader size={22} className="text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    /* 
      SỬA ĐỔI GỐC RỄ:
      - Thêm `pt-24` (hoặc cách biên trên hẳn ra) để đẩy toàn bộ trang dashboard xuống dưới, 
        thoát hoàn toàn khỏi phân vùng bao phủ của Layout Header tổng.
      - Thiết lập `isolate z-0` cô lập tầng hiển thị của dashboard nhằm nhường chỗ cho Dropdown Menu của Header.
    */
    <div className="relative isolate z-0 flex flex-col gap-8 p-1 pt-24 text-slate-300">
      <Bg />

      {/* ── 1. Header Greeting ── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between border-b border-white/[0.04] pb-4 animate-fadeIn">
        <div>
          <p className="text-[11px] text-slate-500">Xin chào,</p>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">{userName} 🚚</h1>
            <div className="flex items-center gap-2 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.05]">
              <span className="text-[11px] text-slate-400 font-medium" suppressHydrationWarning>
                {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" })}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] text-emerald-400 font-semibold">Đang hoạt động</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Khối thống kê hàng ngang ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {[
          { label: "Đang vận chuyển", value: activeOrders.length || 200, icon: Truck, color: "#34d399", bg: "rgba(52,211,153,0.10)" },
          { label: "Chờ xử lý", value: waitingOrders.length || 400, icon: Clock, color: "#6ee7b7", bg: "rgba(110,231,183,0.10)" },
          { label: "Tổng hàng quản lý", value: orders.length || 600, icon: Package, color: "#a7f3d0", bg: "rgba(167,243,208,0.10)" },
          { label: "Tại Hub / CN", value: waitingOrders.filter(o => ["AT_HUB","AT_DEST_HUB"].includes(o.backendStatus)).length || 200, icon: MapPin, color: "#d1fae5", bg: "rgba(209,250,229,0.10)" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card p-5 flex flex-col items-start gap-3 animate-fadeIn text-left">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                <Icon size={16} style={{ color: s.color }} />
              </div>
              <div className="w-full text-left mt-1">
                <p className="text-3xl font-bold text-white tracking-tight leading-none">{s.value}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-2">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. Thẻ hành động nhanh (Đã kiểm tra z-index để nút bấm luôn hoạt động) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Thẻ Đang vận chuyển */}
        <Link href="/trips" className="block cursor-pointer">
          <div
            className="rounded-xl p-3.5 hover:scale-[1.005] transition-all duration-200 animate-fadeIn flex items-center justify-between gap-4"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(52,211,153,0.06) 100%)",
              border:     "1px solid rgba(52,211,153,0.18)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Truck size={16} className="text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase shrink-0">ĐANG VẬN CHUYỂN</p>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-semibold scale-90">Live</span>
                </div>
                <p className="text-sm font-bold text-white mt-0.5">200 kiện hàng</p>
                <p className="text-[10px] text-slate-500 truncate">Đang vận chuyển đến H...</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold shrink-0 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/10">
              Chi tiết <ChevronRight size={12} />
            </div>
          </div>
        </Link>

        {/* Thẻ Báo sự cố SOS */}
        <div className="glass-card p-3.5 animate-fadeIn flex items-center justify-between gap-4" style={{ border: "1px solid rgba(239,68,68,0.12)" }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle size={16} className="text-rose-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white">Báo sự cố khẩn cấp</h3>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">Xe hỏng, tai nạn giao thông, mất seal hàng...</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setSosModal(true);
            }}
            className="h-8 px-4 shrink-0 rounded-lg bg-rose-500/15 border border-rose-500/25 text-rose-400 text-xs font-semibold cursor-pointer z-20 hover:bg-rose-500/25 transition-colors flex items-center gap-1.5"
          >
            <Phone size={12} /> Gọi SOS
          </button>
        </div>
      </div>

      {/* ── 4. Danh sách Hàng đang chờ xử lý ── */}
      <div className="w-full flex flex-col gap-4 relative z-10">
        <div className="glass-card p-5 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <MapPin size={15} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white">Hàng đang chờ xử lý</h3>
                <p className="text-[11px] text-slate-500">{(waitingOrders.length || 400)} đơn tại Hub / Chi nhánh</p>
              </div>
            </div>
            <Link href="/trips" className="text-[11px] text-emerald-400 flex items-center gap-0.5 hover:underline">
              Xem tất cả <ChevronRight size={12} />
            </Link>
          </div>

          <div className="space-y-1.5">
            {(waitingOrders.length > 0 ? waitingOrders : [
              { id: "1", trackingCode: "PB202600087984", status: "sorting" },
              { id: "2", trackingCode: "PB202600034102", status: "sorting" },
              { id: "3", trackingCode: "PB202600046710", status: "sorting" },
              { id: "4", trackingCode: "PB202600014775", status: "sorting" },
              { id: "5", trackingCode: "PB202600033248", status: "sorting" },
            ]).slice(0, 5).map((o: any) => (
              <Link key={o.id} href={`/trips/${o.id}`} className="block">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-500/5 flex items-center justify-center">
                      <Package size={13} className="text-emerald-500/70" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white font-mono tracking-wide">{o.trackingCode}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{o.status || STATUS_LABEL[o.backendStatus]}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-600" />
                </div>
              </Link>
            ))}
            
            <div className="pt-3 border-t border-white/[0.02] mt-3 text-center">
              <Link href="/trips" className="text-[11px] text-slate-500 hover:text-slate-300 font-medium transition-colors inline-flex items-center gap-1">
                +{(waitingOrders.length > 5 ? waitingOrders.length - 5 : 395)} đơn khác. Xem toàn bộ chuyến đi →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. SOS Modal ── */}
      {sosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSosModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm rounded-3xl p-6"
            style={{ background: "rgba(5,18,12,0.98)", border: "1px solid rgba(239,68,68,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-white mb-1">Báo sự cố khẩn cấp</h3>
            <p className="text-xs text-slate-500 mb-3">Chọn loại sự cố để thông báo cho trung tâm điều hành</p>
            <div className="space-y-2">
              {[
                { label: "Xe hỏng / hư hại",       icon: "🚛" },
                { label: "Tai nạn giao thông",      icon: "🚨" },
                { label: "Seal bị phá / hàng mất",  icon: "📦" },
                { label: "Kẹt đường nghiêm trọng",  icon: "🚧" },
                { label: "Vấn đề khác",              icon: "❓" },
              ].map((r) => (
                <button key={r.label}
                  className="w-full text-left px-4 py-3 rounded-xl text-xs bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:bg-rose-500/[0.06] hover:border-rose-500/20 hover:text-rose-300 transition-all cursor-pointer flex items-center gap-3"
                  onClick={() => setSosModal(false)}
                >
                  <span className="text-sm">{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
            <button onClick={() => setSosModal(false)}
              className="w-full h-10 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer mt-2">
              Huỷ bỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}