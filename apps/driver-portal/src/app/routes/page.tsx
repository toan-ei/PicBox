"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, Package, MapPin, CheckCircle, Clock, ChevronRight, Home, Map, ArrowLeftRight, User } from "lucide-react";

function BottomNav({ active }: { active: string }) {
  const NAV = [
    { href: "/", icon: Home, label: "Tổng quan" },
    { href: "/routes", icon: Map, label: "Lộ trình" },
    { href: "/trips", icon: ArrowLeftRight, label: "Chuyến hàng" },
    { href: "/profile", icon: User, label: "Tài khoản" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{ background: "rgba(2,9,5,0.97)", borderTop: "1px solid rgba(52,211,153,0.10)", backdropFilter: "blur(20px)" }}>
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${isActive ? "" : "opacity-50"}`}>
            <Icon size={20} className={isActive ? "text-emerald-400" : "text-slate-500"} />
            <span className={`text-[10px] font-semibold ${isActive ? "text-emerald-400" : "text-slate-600"}`}>{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

const ROUTES = [
  { id: "R01", date: "14/05/2026", trips: [
    { id: "TRIP-0514-00", from: "Hub Q1", to: "Hub Bình Dương", depart: "07:00", arrive: "08:30", parcels: 38, status: "done" },
    { id: "TRIP-0514-01", from: "Hub Q1", to: "Hub Gò Vấp", depart: "10:00", arrive: "11:30", parcels: 48, status: "in-progress" },
    { id: "TRIP-0514-02", from: "Hub Gò Vấp", to: "Hub Q1", depart: "14:00", arrive: "15:30", parcels: 52, status: "pending" },
  ]},
  { id: "R00", date: "13/05/2026", trips: [
    { id: "TRIP-0513-00", from: "Hub BD", to: "Hub Q1", depart: "08:00", arrive: "09:30", parcels: 44, status: "done" },
    { id: "TRIP-0513-01", from: "Hub GV", to: "Hub Q1", depart: "13:00", arrive: "14:20", parcels: 52, status: "done" },
  ]},
];

const STATUS_CONFIG = {
  done:        { label: "Hoàn thành",    color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20", icon: CheckCircle },
  "in-progress":{ label: "Đang chạy",   color: "text-sky-400",     bg: "bg-sky-500/15",     border: "border-sky-500/20",     icon: Truck },
  pending:     { label: "Chưa bắt đầu", color: "text-slate-400",   bg: "bg-slate-500/15",   border: "border-slate-500/20",   icon: Clock },
};

export default function RoutesPage() {
  const [expandedDate, setExpandedDate] = useState("R01");

  return (
    <div className="min-h-screen bg-[#020f0a]">
      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        <div className="mb-5">
          <h1 className="text-[20px] font-bold text-white">Lộ trình</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Kế hoạch vận chuyển của bạn</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Hôm nay", value: "3 chuyến", icon: Truck, color: "#34d399" },
            { label: "Hoàn thành", value: "1/3", icon: CheckCircle, color: "#6ee7b7" },
            { label: "Tổng kiện", value: "138", icon: Package, color: "#a7f3d0" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-card p-3 text-center">
                <Icon size={16} className="mx-auto mb-1.5" style={{ color: s.color }} />
                <p className="text-[14px] font-bold text-white">{s.value}</p>
                <p className="text-[9px] text-slate-600 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Route list by date */}
        <div className="space-y-4">
          {ROUTES.map((route) => (
            <div key={route.id} className="glass-card overflow-hidden">
              <button
                onClick={() => setExpandedDate(expandedDate === route.id ? "" : route.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-white">{route.date}</span>
                  {route.id === "R01" && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-semibold">Hôm nay</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-600">{route.trips.length} chuyến</span>
                  <ChevronRight size={14} className={`text-slate-600 transition-transform ${expandedDate === route.id ? "rotate-90" : ""}`} />
                </div>
              </button>

              {expandedDate === route.id && (
                <div style={{ borderTop: "1px solid rgba(52,211,153,0.06)" }}>
                  {route.trips.map((trip, i) => {
                    const sc = STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG];
                    const Icon = sc.icon;
                    return (
                      <Link key={trip.id} href={`/trips/${trip.id}`}>
                        <div
                          className="px-4 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                          style={i > 0 ? { borderTop: "1px solid rgba(52,211,153,0.04)" } : undefined}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 text-[13px] font-semibold text-white mb-0.5">
                                <span>{trip.from}</span>
                                <ChevronRight size={12} className="text-slate-600" />
                                <span>{trip.to}</span>
                              </div>
                              <p className="text-[11px] text-slate-600">{trip.id}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-xl border ${sc.color} ${sc.bg} ${sc.border}`}>
                              <Icon size={10} /> {sc.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1"><Clock size={10} /> {trip.depart} → {trip.arrive}</span>
                            <span className="flex items-center gap-1"><Package size={10} /> {trip.parcels} kiện</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="/routes" />
    </div>
  );
}
