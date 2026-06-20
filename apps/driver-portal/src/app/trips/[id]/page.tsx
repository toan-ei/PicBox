"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Truck, Package, MapPin, Clock, CheckCircle, QrCode, ChevronRight, Phone, AlertTriangle, Shield, Navigation } from "lucide-react";

const TRIP = {
  id: "TRIP-0514-01",
  from: { hub: "Hub Trung Tâm Q1", address: "123 Nguyễn Huệ, Quận 1, HCM", contact: "Nguyễn Hub", phone: "0281234567" },
  to:   { hub: "Hub Gò Vấp",       address: "456 Quang Trung, Gò Vấp, HCM", contact: "Trần Hub",   phone: "0289876543" },
  depart: "10:00",
  arrive: "11:30",
  vehicle: "51B-12345 (Xe tải 1.5T)",
  sealCode: "SEAL-2026-0514-A",
  status: "in-progress" as const,
  parcels: [
    { id: "PK-001", orders: 12, weight: 28, destination: "Gò Vấp" },
    { id: "PK-002", orders: 8,  weight: 15, destination: "Bình Thạnh" },
    { id: "PK-003", orders: 18, weight: 42, destination: "Gò Vấp" },
    { id: "PK-004", orders: 10, weight: 35, destination: "Gò Vấp" },
  ],
};

const CHECKLIST = [
  { key: "load",    label: "Bốc hàng tại Hub Q1",        desc: "Scan & xác nhận kiện hàng" },
  { key: "seal",    label: "Seal xe & kiểm tra",          desc: "Mã seal: " + "SEAL-2026-0514-A" },
  { key: "depart",  label: "Xuất phát",                   desc: "GPS bắt đầu tracking" },
  { key: "arrive",  label: "Đến Hub Gò Vấp",              desc: "Xác nhận GPS tại hub đích" },
  { key: "unload",  label: "Dỡ hàng tại Hub Gò Vấp",     desc: "Scan bàn giao kiện hàng" },
  { key: "confirm", label: "Xác nhận bàn giao hoàn tất",  desc: "NV kho ký xác nhận" },
];

export default function TripDetailPage() {
  const router = useRouter();
  const [checklist, setChecklist] = useState(CHECKLIST.map((c, i) => ({ ...c, done: i < 3 })));
  const [qrModal, setQrModal] = useState(false);
  const [sosModal, setSosModal] = useState(false);

  const doneCount = checklist.filter((c) => c.done).length;
  const progress = Math.round((doneCount / checklist.length) * 100);
  const totalOrders = TRIP.parcels.reduce((s, p) => s + p.orders, 0);
  const totalWeight = TRIP.parcels.reduce((s, p) => s + p.weight, 0);

  function toggleCheck(key: string) {
    setChecklist((prev) =>
      prev.map((c) => (c.key === key ? { ...c, done: !c.done } : c))
    );
  }

  return (
    <div className="min-h-screen bg-[#020f0a]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-6 pb-4 animate-fadeIn">
          <button onClick={() => router.back()} className="h-10 w-10 rounded-xl glass flex items-center justify-center cursor-pointer press-effect">
            <ArrowLeft size={16} className="text-slate-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-bold text-white">{TRIP.id}</h1>
            <p className="text-[11px] text-slate-500">Chi tiết chuyến vận chuyển</p>
          </div>
          <button
            onClick={() => setQrModal(true)}
            className="h-10 w-10 rounded-xl glass flex items-center justify-center cursor-pointer press-effect"
          >
            <QrCode size={16} className="text-emerald-400" />
          </button>
          <button
            onClick={() => setSosModal(true)}
            className="h-10 w-10 rounded-xl flex items-center justify-center cursor-pointer press-effect"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
          >
            <AlertTriangle size={16} className="text-rose-400" />
          </button>
        </div>

        <div className="px-4 pb-28 space-y-4">
          {/* Progress */}
          <div className="glass-card p-5 animate-slideUp">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-slate-500">Tiến trình chuyến hàng</span>
              <span className="text-[13px] font-bold text-emerald-400">{progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/[0.06] mb-4">
              <div
                className="h-full rounded-full transition-all duration-700 animate-progress-glow"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #10b981, #34d399)" }}
              />
            </div>

            <div className="space-y-0">
              {checklist.map((item, i) => (
                <button
                  key={item.key}
                  onClick={() => toggleCheck(item.key)}
                  className="w-full flex items-start gap-3 text-left cursor-pointer group"
                >
                  <div className="flex flex-col items-center pt-0.5">
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      item.done ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-white/[0.03] border-slate-700 group-hover:border-emerald-500/50"
                    }`}>
                      {item.done && <CheckCircle size={13} className="text-white" />}
                    </div>
                    {i < checklist.length - 1 && (
                      <div className={`w-0.5 h-5 mt-1 transition-all ${item.done ? "bg-emerald-500/40" : "bg-white/[0.05]"}`} />
                    )}
                  </div>
                  <div className="pb-3">
                    <span className={`text-[12px] font-medium transition-colors ${item.done ? "text-emerald-400" : "text-slate-400"}`}>
                      {item.label}
                    </span>
                    <p className={`text-[10px] mt-0.5 ${item.done ? "text-slate-600" : "text-slate-700"}`}>{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Route info */}
          <div className="glass-card p-4 animate-fadeIn" style={{ animationDelay: "100ms" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Tuyến đường</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[9px] font-bold text-emerald-400">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white">{TRIP.from.hub}</p>
                  <p className="text-[11px] text-slate-500">{TRIP.from.address}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-emerald-400 font-semibold">Xuất phát: {TRIP.depart}</span>
                    <a href={`tel:${TRIP.from.phone}`} className="flex items-center gap-1 text-[10px] text-cyan-400 cursor-pointer">
                      <Phone size={9} /> {TRIP.from.contact}
                    </a>
                  </div>
                </div>
              </div>
              <div className="ml-3.5 flex items-center gap-2">
                <div className="w-px h-5 bg-slate-700" />
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <Truck size={10} /> {TRIP.vehicle}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[9px] font-bold text-sky-400">B</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white">{TRIP.to.hub}</p>
                  <p className="text-[11px] text-slate-500">{TRIP.to.address}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-sky-400 font-semibold">Dự kiến đến: {TRIP.arrive}</span>
                    <a href={`tel:${TRIP.to.phone}`} className="flex items-center gap-1 text-[10px] text-cyan-400 cursor-pointer">
                      <Phone size={9} /> {TRIP.to.contact}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seal info */}
          <div className="glass-card p-4 animate-fadeIn" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Shield size={15} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Mã seal xe</p>
                  <p className="text-[13px] font-bold text-white font-mono">{TRIP.sealCode}</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-lg font-semibold">
                ✓ INTACT
              </span>
            </div>
          </div>

          {/* Parcels */}
          <div className="glass-card p-4 animate-fadeIn" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Kiện hàng ({TRIP.parcels.length} pallet)</p>
              <span className="text-[11px] text-emerald-400 font-semibold">{totalOrders} đơn · {totalWeight} kg</span>
            </div>
            <div className="space-y-2.5">
              {TRIP.parcels.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.05] px-3 py-3 hover:bg-white/[0.05] transition-all cursor-pointer press-effect">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Package size={13} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-white">{p.id}</p>
                      <p className="text-[10px] text-slate-600">{p.destination} · {p.weight}kg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 font-medium">{p.orders} đơn</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom action */}
        <div className="fixed bottom-0 left-0 right-0 px-4 pt-4"
          style={{
            background: "rgba(2,9,5,0.97)",
            borderTop: "1px solid rgba(52,211,153,0.08)",
            backdropFilter: "blur(20px)",
            paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
          }}>
          <div className="max-w-md mx-auto">
            <button
              className="w-full h-13 rounded-2xl text-white text-[14px] font-bold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all active:scale-[0.98]"
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
          <div className="relative glass-card p-6 text-center max-w-xs w-full animate-fadeInScale" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[15px] font-bold text-white mb-4">QR Chuyến hàng</h3>
            <div className="h-44 w-44 mx-auto rounded-2xl bg-white flex items-center justify-center mb-4 p-4">
              <div className="grid grid-cols-7 gap-0.5 w-full h-full">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div key={i} className={`rounded-sm ${[0,1,2,5,6,7,8,13,14,35,36,41,42,43,46,47,48].includes(i) || Math.random() > 0.5 ? "bg-slate-900" : "bg-white"}`} />
                ))}
              </div>
            </div>
            <p className="text-[13px] text-white font-semibold mb-0.5">{TRIP.id}</p>
            <p className="text-[10px] text-slate-500 mb-4">Quét để xác nhận bàn giao tại hub</p>
            <button
              onClick={() => setQrModal(false)}
              className="w-full h-10 rounded-xl text-[12px] text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08] transition-colors cursor-pointer press-effect"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* SOS modal */}
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
                { label: "Xe hỏng / hư hại", icon: "🚛" },
                { label: "Tai nạn giao thông", icon: "🚨" },
                { label: "Seal bị phá / hàng mất", icon: "📦" },
                { label: "Kẹt đường nghiêm trọng", icon: "🚧" },
                { label: "Vấn đề khác", icon: "❓" },
              ].map((r) => (
                <button
                  key={r.label}
                  className="w-full text-left px-4 py-3.5 rounded-xl text-[13px] bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:bg-rose-500/[0.06] hover:border-rose-500/20 hover:text-rose-300 transition-all cursor-pointer press-effect flex items-center gap-3"
                >
                  <span className="text-[16px]">{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSosModal(false)}
              className="w-full h-10 text-[13px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Huỷ bỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
