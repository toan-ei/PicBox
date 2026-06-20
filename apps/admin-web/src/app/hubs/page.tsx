"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout";
import { MapPin, Package, Truck, Users, Plus, Activity } from "lucide-react";

type HubType = "hub" | "branch";
type HubStatus = "active" | "full" | "maintenance";

interface Hub {
  id: string;
  name: string;
  type: HubType;
  address: string;
  district: string;
  city: string;
  capacity: number;
  currentLoad: number;
  shippers: number;
  pendingOrders: number;
  status: HubStatus;
  manager: string;
}

const HUBS: Hub[] = [
  { id: "HUB-HCM-01", name: "Hub Trung Tâm HCM", type: "hub", address: "123 Nguyễn Huệ", district: "Quận 1", city: "TP.HCM", capacity: 500, currentLoad: 320, shippers: 45, pendingOrders: 87, status: "active", manager: "Nguyễn Ops" },
  { id: "HUB-HCM-02", name: "Hub Gò Vấp", type: "hub", address: "456 Quang Trung", district: "Gò Vấp", city: "TP.HCM", capacity: 300, currentLoad: 295, shippers: 28, pendingOrders: 63, status: "full", manager: "Trần Quản" },
  { id: "BR-HCM-01", name: "Chi nhánh Bình Thạnh", type: "branch", address: "789 Đinh Tiên Hoàng", district: "Bình Thạnh", city: "TP.HCM", capacity: 150, currentLoad: 80, shippers: 15, pendingOrders: 24, status: "active", manager: "Lê Phụ trách" },
  { id: "BR-HCM-02", name: "Chi nhánh Tân Bình", type: "branch", address: "321 Cộng Hòa", district: "Tân Bình", city: "TP.HCM", capacity: 200, currentLoad: 45, shippers: 18, pendingOrders: 31, status: "maintenance", manager: "Phạm Quản" },
  { id: "HUB-BD-01", name: "Hub Bình Dương", type: "hub", address: "654 Đại lộ Bình Dương", district: "Thủ Dầu Một", city: "Bình Dương", capacity: 400, currentLoad: 210, shippers: 32, pendingOrders: 55, status: "active", manager: "Võ Ops" },
  { id: "BR-LA-01", name: "Chi nhánh Long An", type: "branch", address: "987 QL1A", district: "Tân An", city: "Long An", capacity: 120, currentLoad: 90, shippers: 10, pendingOrders: 18, status: "active", manager: "Đỗ Phụ trách" },
];

const STATUS_CONFIG: Record<HubStatus, { label: string; color: string; bg: string; border: string }> = {
  active:      { label: "Hoạt động",   color: "text-emerald-400", bg: "bg-emerald-500/10",  border: "border-emerald-500/15" },
  full:        { label: "Đầy tải",     color: "text-amber-400",   bg: "bg-amber-500/10",    border: "border-amber-500/15" },
  maintenance: { label: "Bảo trì",    color: "text-slate-400",   bg: "bg-slate-500/10",    border: "border-slate-500/15" },
};

export default function HubsPage() {
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = typeFilter === "all" ? HUBS : HUBS.filter((h) => h.type === typeFilter);
  const totalCapacity = HUBS.reduce((s, h) => s + h.capacity, 0);
  const totalLoad = HUBS.reduce((s, h) => s + h.currentLoad, 0);
  const totalShippers = HUBS.reduce((s, h) => s + h.shippers, 0);
  const totalPending = HUBS.reduce((s, h) => s + h.pendingOrders, 0);

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Hub & Chi nhánh</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Quản lý mạng lưới kho vận và điểm giao dịch</p>
          </div>
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer">
            <Plus size={15} /> Thêm Hub
          </button>
        </div>

        {/* System summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 stagger">
          {[
            { label: "Tổng công suất", value: `${totalCapacity}`, unit: "kiện", icon: Activity, color: "text-indigo-400", bg: "bg-indigo-500/[0.08]" },
            { label: "Đang chứa", value: `${totalLoad}`, unit: `${Math.round(totalLoad/totalCapacity*100)}%`, icon: Package, color: "text-amber-400", bg: "bg-amber-500/[0.08]" },
            { label: "Shipper tổng", value: `${totalShippers}`, unit: "người", icon: Users, color: "text-sky-400", bg: "bg-sky-500/[0.08]" },
            { label: "Đơn chờ", value: `${totalPending}`, unit: "đơn", icon: Truck, color: "text-emerald-400", bg: "bg-emerald-500/[0.08]" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass rounded-2xl p-4 animate-fadeIn">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon size={16} className={s.color} />
                  </div>
                  <span className="text-[11px] text-slate-500">{s.label}</span>
                </div>
                <p className="text-[24px] font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-slate-600">{s.unit}</p>
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5">
          {[
            { key: "all", label: "Tất cả" },
            { key: "hub", label: "Hub chính" },
            { key: "branch", label: "Chi nhánh" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                typeFilter === f.key
                  ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                  : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Hub grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((hub) => {
            const sc = STATUS_CONFIG[hub.status];
            const loadPct = Math.round((hub.currentLoad / hub.capacity) * 100);
            const loadColor = loadPct >= 90 ? "#f87171" : loadPct >= 70 ? "#fbbf24" : "#34d399";

            return (
              <div key={hub.id} className="glass rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${hub.type === "hub" ? "bg-indigo-500/[0.12]" : "bg-purple-500/[0.12]"}`}
                    >
                      <MapPin size={16} className={hub.type === "hub" ? "text-indigo-400" : "text-purple-400"} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white leading-tight">{hub.name}</p>
                      <p className="text-[10px] text-slate-600">{hub.id}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-lg border ${sc.color} ${sc.bg} ${sc.border}`}>
                    {sc.label}
                  </span>
                </div>

                {/* Address */}
                <p className="text-[12px] text-slate-500 mb-4">
                  {hub.address}, {hub.district}, {hub.city}
                </p>

                {/* Capacity bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-slate-600">Công suất sử dụng</span>
                    <span className="text-[11px] font-semibold" style={{ color: loadColor }}>{loadPct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${loadPct}%`, background: loadColor, boxShadow: `0 0 8px ${loadColor}40` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-700 mt-1">{hub.currentLoad} / {hub.capacity} kiện</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Shipper", value: hub.shippers },
                    { label: "Chờ giao", value: hub.pendingOrders },
                    { label: "Quản lý", value: hub.manager.split(" ")[0] },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center rounded-xl bg-white/[0.03] border border-white/[0.04] py-2">
                      <p className="text-[13px] font-bold text-white">{stat.value}</p>
                      <p className="text-[9px] text-slate-600 uppercase tracking-wide mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
