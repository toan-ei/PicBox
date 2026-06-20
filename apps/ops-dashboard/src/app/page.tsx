"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import OpsLayout from "@/components/layout/ops-layout";
import {
  Package, MapPin, AlertTriangle, ChevronRight, Activity,
  Clock, CheckCircle, Truck, Users, TrendingUp, Zap,
} from "lucide-react";

/* ── Live feed item ── */
const LIVE_FEED_INITIAL = [
  { id: "F001", type: "order_created", msg: "Đơn PB-20260020 được tạo bởi Sender mới", time: "13 giây trước", color: "#6366f1", icon: "📦" },
  { id: "F002", type: "shipper_assigned", msg: "Shipper Lê Văn Tùng nhận đơn PB-20260018", time: "45 giây trước", color: "#38bdf8", icon: "🛵" },
  { id: "F003", type: "delivered", msg: "Đơn PB-20260010 giao thành công", time: "1 phút trước", color: "#34d399", icon: "✅" },
  { id: "F004", type: "failed", msg: "Đơn PB-20260009 thất bại: Người nhận vắng mặt", time: "2 phút trước", color: "#f87171", icon: "❌" },
  { id: "F005", type: "hub_alert", msg: "Hub Gò Vấp đạt 98% công suất!", time: "3 phút trước", color: "#fbbf24", icon: "⚠️" },
  { id: "F006", type: "order_created", msg: "Đơn PB-20260019 được tạo", time: "4 phút trước", color: "#6366f1", icon: "📦" },
  { id: "F007", type: "delivered", msg: "Đơn PB-20260008 giao thành công", time: "5 phút trước", color: "#34d399", icon: "✅" },
];

const KPI = [
  { label: "Đơn hôm nay", value: "248", change: "+12", icon: Package, color: "#6366f1", bg: "rgba(99,102,241,0.10)" },
  { label: "Đang giao", value: "87", change: "live", icon: Truck, color: "#38bdf8", bg: "rgba(56,189,248,0.10)" },
  { label: "Hoàn thành", value: "143", change: "57.7%", icon: CheckCircle, color: "#34d399", bg: "rgba(52,211,153,0.10)" },
  { label: "Shipper online", value: "34", change: "+5", icon: Users, color: "#fbbf24", bg: "rgba(251,191,36,0.10)" },
];

const PENDING_ORDERS = [
  { id: "PB-20260020", customer: "Trần Văn Mới", zone: "Quận 7", cod: 250000, wait: "5 phút", priority: "high" },
  { id: "PB-20260019", customer: "Lê Thị Oanh", zone: "Bình Thạnh", cod: 0, wait: "12 phút", priority: "medium" },
  { id: "PB-20260015", customer: "Phạm Minh Tuấn", zone: "Gò Vấp", cod: 180000, wait: "18 phút", priority: "low" },
];

const HUBS = [
  { name: "Hub Q1", load: 64, status: "ok", orders: 120 },
  { name: "Hub Gò Vấp", load: 98, status: "full", orders: 245 },
  { name: "Hub Bình Dương", load: 52, status: "ok", orders: 85 },
  { name: "CN Long An", load: 75, status: "ok", orders: 95 },
];

export default function OpsMonitorPage() {
  const [liveFeed, setLiveFeed] = useState(LIVE_FEED_INITIAL);
  const [newEvent, setNewEvent] = useState(false);

  // Simulate new events
  useEffect(() => {
    const t = setInterval(() => {
      setNewEvent(true);
      setTimeout(() => setNewEvent(false), 1000);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <OpsLayout>
      {/* Header */}
      <div className="mb-6 animate-fadeIn">
        <h2 className="text-[20px] font-bold text-white flex items-center gap-2">
          Live Monitor
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
          </span>
        </h2>
        <p className="text-[13px] text-slate-500 mt-0.5">Giám sát thời gian thực hệ thống vận hành chặng cuối</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6 stagger">
        {KPI.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="glass rounded-2xl p-4 sm:p-5 animate-fadeIn hover:scale-[1.02] transition-transform cursor-default">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: k.bg }}>
                  <Icon size={18} style={{ color: k.color }} />
                </div>
                <span className="text-[11px] font-semibold" style={{ color: k.color }}>
                  {k.change === "live" ? <span className="animate-pulse-dot">● LIVE</span> : k.change}
                </span>
              </div>
              <p className="text-[26px] sm:text-[28px] font-bold text-white leading-none">{k.value}</p>
              <p className="text-[11px] text-slate-500 mt-1">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main content: feed + pending */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Live feed */}
        <div className="xl:col-span-2 glass rounded-2xl overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5" style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
              <Activity size={14} className="text-amber-400" />
              Luồng sự kiện vận hành
            </h3>
            <div className="flex items-center gap-2">
              {newEvent && (
                <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md font-semibold animate-fadeInScale">
                  NEW
                </span>
              )}
              <span className="text-[10px] text-amber-400 font-semibold animate-pulse-dot">● LIVE</span>
            </div>
          </div>
          <div className="divide-y divide-white/[0.03] max-h-[420px] overflow-y-auto">
            {liveFeed.map((ev, i) => (
              <div key={ev.id} className={`flex items-start gap-3 px-4 sm:px-5 py-3.5 hover:bg-white/[0.015] transition-colors ${i === 0 && newEvent ? "animate-fadeIn" : ""}`}>
                <span className="text-[14px] flex-shrink-0 mt-0.5">{ev.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-slate-300 leading-relaxed">{ev.msg}</p>
                </div>
                <span className="text-[10px] text-slate-700 flex-shrink-0 whitespace-nowrap">{ev.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending orders needing shipper */}
        <div className="glass rounded-2xl overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5" style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
              <Clock size={14} className="text-amber-400" />
              Cần gán shipper
            </h3>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded-md">{PENDING_ORDERS.length}</span>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {PENDING_ORDERS.map((o) => (
              <div key={o.id} className="px-4 py-3.5">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-white">{o.id}</p>
                      {o.priority === "high" && (
                        <Zap size={10} className="text-amber-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{o.customer} · {o.zone}</p>
                  </div>
                  <span className={`text-[10px] border px-1.5 py-0.5 rounded-md font-semibold flex-shrink-0 ${
                    parseInt(o.wait) > 15
                      ? "text-rose-400 bg-rose-500/15 border-rose-500/20"
                      : "text-amber-400 bg-amber-500/15 border-amber-500/20"
                  }`}>
                    {o.wait}
                  </span>
                </div>
                {o.cod > 0 && <p className="text-[11px] text-emerald-400 mb-2.5 font-medium">COD ₫{o.cod.toLocaleString()}</p>}
                <Link
                  href="/branch/dispatch"
                  className="w-full h-9 rounded-xl text-[12px] font-semibold text-amber-400 border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 press-effect"
                >
                  <Truck size={12} /> Đến Bảng điều phối
                </Link>
              </div>
            ))}
          </div>
          <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(251,191,36,0.04)" }}>
            <Link href="/orders" className="text-[12px] text-amber-400/70 hover:text-amber-400 transition-colors flex items-center gap-1 press-effect">
              Xem tất cả đơn <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Hub status */}
      <div className="mt-4 glass rounded-2xl p-4 sm:p-5 animate-fadeIn">
        <h3 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin size={14} className="text-amber-400" /> Trạng thái Hub & Tải trọng hiện tại
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {HUBS.map((h) => {
            const color = h.load >= 90 ? "#f87171" : h.load >= 75 ? "#fbbf24" : "#34d399";
            return (
              <div key={h.name} className="rounded-xl p-3.5 hover:scale-[1.02] transition-transform cursor-default"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-medium text-white truncate">{h.name}</p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {h.status === "full" && <AlertTriangle size={12} className="text-amber-400 animate-pulse" />}
                    <span className="text-[10px] text-slate-500">{h.orders} đơn</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] mb-2">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${h.load}%`,
                      background: color,
                      boxShadow: h.load >= 90 ? `0 0 8px ${color}40` : "none",
                    }} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold" style={{ color }}>{h.load}%</p>
                  <p className="text-[10px] text-slate-600">
                    {h.load >= 90 ? "Gần đầy" : h.load >= 75 ? "Cao" : "Bình thường"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick throughput */}
      <div className="mt-4 glass rounded-2xl p-4 sm:p-5 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-400" /> Throughput hôm nay
          </h3>
          <span className="text-[10px] text-slate-600">Cập nhật mỗi 5 phút</span>
        </div>
        <div className="flex items-end gap-1 h-20">
          {[35, 42, 58, 65, 48, 72, 80, 68, 55, 90, 85, 78, 60, 45, 70, 88, 95, 82, 65, 50, 40, 55, 70, 85].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all duration-500"
              style={{
                height: `${v}%`,
                background: v > 80 ? "linear-gradient(180deg, #34d399, #10b981)" : "linear-gradient(180deg, rgba(251,191,36,0.4), rgba(251,191,36,0.15))",
                animationDelay: `${i * 30}ms`,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[9px] text-slate-700">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>Hiện tại</span>
        </div>
      </div>
    </OpsLayout>
  );
}
