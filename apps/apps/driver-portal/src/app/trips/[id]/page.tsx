"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Truck, Package, MapPin, Clock, CheckCircle, QrCode, ChevronRight } from "lucide-react";

const TRIP = {
  id: "TRIP-0514-01",
  from: { hub: "Hub Trung Tâm Q1", address: "123 Nguyễn Huệ, Quận 1, HCM", contact: "Nguyễn Hub", phone: "0281234567" },
  to:   { hub: "Hub Gò Vấp",       address: "456 Quang Trung, Gò Vấp, HCM", contact: "Trần Hub",   phone: "0289876543" },
  depart: "10:00",
  arrive: "11:30",
  vehicle: "51B-12345 (Xe tải 1.5T)",
  status: "in-progress" as const,
  parcels: [
    { id: "PK-001", orders: 12, weight: 28, destination: "Gò Vấp" },
    { id: "PK-002", orders: 8,  weight: 15, destination: "Bình Thạnh" },
    { id: "PK-003", orders: 18, weight: 42, destination: "Gò Vấp" },
    { id: "PK-004", orders: 10, weight: 35, destination: "Gò Vấp" },
  ],
};

const CHECKLIST = [
  { key: "load",    label: "Bốc hàng tại Hub Q1",        done: true },
  { key: "depart",  label: "Xuất phát",                   done: true },
  { key: "arrive",  label: "Đến Hub Gò Vấp",              done: false },
  { key: "unload",  label: "Dỡ hàng tại Hub Gò Vấp",     done: false },
  { key: "confirm", label: "Xác nhận bàn giao hoàn tất",  done: false },
];

export default function TripDetailPage() {
  const router = useRouter();
  const [checklist, setChecklist] = useState(CHECKLIST);
  const [qrModal, setQrModal] = useState(false);

  const doneCount = checklist.filter((c) => c.done).length;
  const progress = Math.round((doneCount / checklist.length) * 100);

  function toggleCheck(key: string) {
    setChecklist((prev) =>
      prev.map((c) => (c.key === key ? { ...c, done: !c.done } : c))
    );
  }

  return (
    <div className="min-h-screen bg-[#020f0a]">
      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-6 pb-4">
          <button onClick={() => router.back()} className="h-9 w-9 rounded-xl glass flex items-center justify-center cursor-pointer">
            <ArrowLeft size={16} className="text-slate-400" />
          </button>
          <div>
            <h1 className="text-[16px] font-bold text-white">{TRIP.id}</h1>
            <p className="text-[11px] text-slate-500">Chi tiết chuyến vận chuyển</p>
          </div>
          <button
            onClick={() => setQrModal(true)}
            className="ml-auto h-9 w-9 rounded-xl glass flex items-center justify-center cursor-pointer"
          >
            <QrCode size={16} className="text-emerald-400" />
          </button>
        </div>

        <div className="px-4 pb-24 space-y-4">
          {/* Progress */}
          <div className="glass-card p-4">
            <div className="flex justify-between mb-2">
              <span className="text-[12px] text-slate-500">Tiến trình chuyến hàng</span>
              <span className="text-[12px] font-bold text-emerald-400">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] mb-3">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #10b981, #34d399)", boxShadow: "0 0 8px rgba(52,211,153,0.4)" }}
              />
            </div>
            <div className="space-y-2.5">
              {checklist.map((item, i) => (
                <button
                  key={item.key}
                  onClick={() => toggleCheck(item.key)}
                  className="w-full flex items-center gap-3 text-left cursor-pointer group"
                >
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    item.done ? "bg-emerald-500 border-emerald-500" : "bg-white/[0.03] border-slate-700 group-hover:border-emerald-500/50"
                  }`}>
                    {item.done && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <span className={`text-[12px] transition-colors ${item.done ? "text-emerald-400 line-through decoration-emerald-600" : "text-slate-400"}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Route info */}
          <div className="glass-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Tuyến đường</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[8px] font-bold text-emerald-400">A</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{TRIP.from.hub}</p>
                  <p className="text-[11px] text-slate-500">{TRIP.from.address}</p>
                  <p className="text-[11px] text-emerald-400 mt-0.5">Xuất phát: {TRIP.depart}</p>
                </div>
              </div>
              <div className="ml-3 h-6 flex items-center gap-2">
                <div className="w-px h-full bg-slate-700" />
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <Truck size={10} /> {TRIP.vehicle}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[8px] font-bold text-sky-400">B</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{TRIP.to.hub}</p>
                  <p className="text-[11px] text-slate-500">{TRIP.to.address}</p>
                  <p className="text-[11px] text-sky-400 mt-0.5">Dự kiến đến: {TRIP.arrive}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Parcels */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Kiện hàng ({TRIP.parcels.length} pallet)</p>
              <span className="text-[11px] text-emerald-400">{TRIP.parcels.reduce((s, p) => s + p.orders, 0)} đơn · {TRIP.parcels.reduce((s, p) => s + p.weight, 0)} kg</span>
            </div>
            <div className="space-y-2.5">
              {TRIP.parcels.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Package size={13} className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-[12px] font-semibold text-white">{p.id}</p>
                      <p className="text-[10px] text-slate-600">{p.destination} · {p.weight}kg</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">{p.orders} đơn</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom action */}
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4"
          style={{ background: "rgba(2,9,5,0.97)", borderTop: "1px solid rgba(52,211,153,0.08)", backdropFilter: "blur(20px)" }}>
          <div className="max-w-md mx-auto">
            <button
              className="w-full h-12 rounded-2xl text-white text-[14px] font-bold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #10b981, #34d399)", boxShadow: "0 4px 20px -4px rgba(16,185,129,0.5)" }}
            >
              <CheckCircle size={16} /> Xác nhận đến Hub Gò Vấp
            </button>
          </div>
        </div>
      </div>

      {/* QR modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setQrModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative glass-card p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[14px] font-bold text-white mb-4">QR Chuyến hàng</h3>
            <div className="h-40 w-40 mx-auto rounded-2xl bg-white flex items-center justify-center mb-3">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`h-3 w-3 rounded-sm ${Math.random() > 0.4 ? "bg-slate-900" : "bg-white"}`} />
                ))}
              </div>
            </div>
            <p className="text-[12px] text-slate-500 mb-1">{TRIP.id}</p>
            <p className="text-[10px] text-slate-700">Quét để xác nhận bàn giao tại hub</p>
            <button onClick={() => setQrModal(false)} className="mt-4 text-[12px] text-emerald-400 cursor-pointer">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
