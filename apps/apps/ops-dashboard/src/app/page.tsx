"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import OpsLayout from "@/components/layout/ops-layout";
import {
  Package, MapPin, AlertTriangle, ChevronRight, Activity,
  Clock, CheckCircle, Truck, Users,
} from "lucide-react";

/* ── Live feed item ── */
const LIVE_FEED = [
  { id: "F001", type: "order_created", msg: "Đơn PB-20260020 được tạo bởi Sender mới", time: "13 giây trước", color: "#6366f1" },
  { id: "F002", type: "shipper_assigned", msg: "Shipper Lê Văn Tùng nhận đơn PB-20260018", time: "45 giây trước", color: "#38bdf8" },
  { id: "F003", type: "delivered", msg: "Đơn PB-20260010 giao thành công", time: "1 phút trước", color: "#34d399" },
  { id: "F004", type: "failed", msg: "Đơn PB-20260009 thất bại: Người nhận vắng mặt", time: "2 phút trước", color: "#f87171" },
  { id: "F005", type: "hub_alert", msg: "Hub Gò Vấp đạt 98% công suất!", time: "3 phút trước", color: "#fbbf24" },
  { id: "F006", type: "order_created", msg: "Đơn PB-20260019 được tạo", time: "4 phút trước", color: "#6366f1" },
  { id: "F007", type: "delivered", msg: "Đơn PB-20260008 giao thành công", time: "5 phút trước", color: "#34d399" },
];

const KPI = [
  { label: "Đơn hôm nay", value: "248", change: "+12", icon: Package, color: "#6366f1", bg: "rgba(99,102,241,0.10)" },
  { label: "Đang giao", value: "87", change: "live", icon: Truck, color: "#38bdf8", bg: "rgba(56,189,248,0.10)" },
  { label: "Hoàn thành", value: "143", change: "57.7%", icon: CheckCircle, color: "#34d399", bg: "rgba(52,211,153,0.10)" },
  { label: "Shipper online", value: "34", change: "+5", icon: Users, color: "#fbbf24", bg: "rgba(251,191,36,0.10)" },
];

const PENDING_ORDERS = [
  { id: "PB-20260020", customer: "Trần Văn Mới", zone: "Quận 7", cod: 250000, wait: "5 phút" },
  { id: "PB-20260019", customer: "Lê Thị Oanh", zone: "Bình Thạnh", cod: 0, wait: "12 phút" },
  { id: "PB-20260015", customer: "Phạm Minh Tuấn", zone: "Gò Vấp", cod: 180000, wait: "18 phút" },
];

export default function OpsMonitorPage() {
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
            <div key={k.label} className="glass rounded-2xl p-5 animate-fadeIn">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: k.bg }}>
                  <Icon size={18} style={{ color: k.color }} />
                </div>
                <span className="text-[11px] font-semibold" style={{ color: k.color }}>
                  {k.change === "live" ? <span className="animate-pulse-dot">● LIVE</span> : `+${k.change}`}
                </span>
              </div>
              <p className="text-[28px] font-bold text-white leading-none">{k.value}</p>
              <p className="text-[11px] text-slate-500 mt-1">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main content: feed + pending */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Live feed */}
        <div className="xl:col-span-2 glass rounded-2xl overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
              <Activity size={14} className="text-amber-400" />
              Luồng sự kiện vận hành
            </h3>
            <span className="text-[10px] text-amber-400 font-semibold animate-pulse">● LIVE</span>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {LIVE_FEED.map((ev) => (
              <div key={ev.id} className="flex items-start gap-3 px-5 py-3 hover:bg-white/[0.015] transition-colors">
                <div className="h-2 w-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: ev.color, boxShadow: `0 0 6px ${ev.color}` }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-slate-300">{ev.msg}</p>
                </div>
                <span className="text-[10px] text-slate-700 flex-shrink-0">{ev.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending orders needing shipper */}
        <div className="glass rounded-2xl overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
              <Clock size={14} className="text-amber-400" />
              Cần gán shipper
            </h3>
            <span className="text-[12px] font-bold text-amber-400">{PENDING_ORDERS.length}</span>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {PENDING_ORDERS.map((o) => (
              <div key={o.id} className="px-4 py-3.5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[13px] font-semibold text-white">{o.id}</p>
                    <p className="text-[11px] text-slate-500">{o.customer} · {o.zone}</p>
                  </div>
                  <span className="text-[10px] text-amber-400 bg-amber-500/15 border border-amber-500/20 px-1.5 py-0.5 rounded-md font-semibold flex-shrink-0">
                    {o.wait}
                  </span>
                </div>
                {o.cod > 0 && <p className="text-[11px] text-emerald-400 mb-2">COD ₫{o.cod.toLocaleString()}</p>}
                <Link
                  href="/branch/dispatch"
                  className="w-full h-8 rounded-xl text-[12px] font-semibold text-amber-400 border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Truck size={12} /> Đến Bảng điều phối
                </Link>
              </div>
            ))}
          </div>
          <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(251,191,36,0.04)" }}>
            <Link href="/orders" className="text-[12px] text-amber-400/70 hover:text-amber-400 transition-colors flex items-center gap-1">
              Xem tất cả đơn <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Hub status mini */}
      <div className="mt-4 glass rounded-2xl p-5 animate-fadeIn">
        <h3 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin size={14} className="text-amber-400" /> Trạng thái Hub & Tải trọng hiện tại
        </h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { name: "Hub Q1", load: 64, status: "ok" },
            { name: "Hub Gò Vấp", load: 98, status: "full" },
            { name: "Hub Bình Dương", load: 52, status: "ok" },
            { name: "Chi nhánh Long An", load: 75, status: "ok" },
          ].map((h) => {
            const color = h.load >= 90 ? "#f87171" : h.load >= 75 ? "#fbbf24" : "#34d399";
            return (
              <div key={h.name} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-medium text-white truncate">{h.name}</p>
                  {h.status === "full" && <AlertTriangle size={12} className="text-amber-400 flex-shrink-0 animate-pulse" />}
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] mb-1.5">
                  <div className="h-full rounded-full transition-all" style={{ width: `${h.load}%`, background: color }} />
                </div>
                <p className="text-[11px] font-semibold" style={{ color }}>{h.load}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </OpsLayout>
  );
}
