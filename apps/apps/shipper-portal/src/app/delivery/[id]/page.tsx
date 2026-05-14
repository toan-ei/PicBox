"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Phone, MapPin, Package, MessageCircle,
  CheckCircle, Camera, AlertCircle, ChevronRight,
  Navigation, Copy,
} from "lucide-react";

/* Mock data for delivery ID PB-20260003 */
const ORDER = {
  id: "PB-20260003",
  customer: { name: "Lê Văn C", phone: "0923456789", address: "45 Nguyễn Văn Linh, P. Hiệp Bình Chánh, Thủ Đức, HCM" },
  sender:   { name: "Cửa hàng Áo Đẹp", phone: "0901111111", address: "95 Trần Hưng Đạo, P.5, Quận 3, HCM" },
  cod: 180000,
  fee: 42000,
  weight: 2.1,
  note: "Gọi trước khi giao. Để ở bảo vệ nếu vắng.",
  items: [{ name: "Áo sơ mi nam", qty: 2 }, { name: "Quần kaki", qty: 1 }],
};

const STEPS = [
  { key: "picking",    label: "Đang lấy hàng",   desc: "Đến điểm gửi lấy đơn" },
  { key: "picked",     label: "Đã lấy hàng",      desc: "Đã nhận hàng, đang di chuyển" },
  { key: "delivering", label: "Đang giao",         desc: "Đến địa chỉ người nhận" },
  { key: "delivered",  label: "Giao thành công",   desc: "Người nhận đã ký xác nhận" },
];

export default function DeliveryDetailPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [failModal, setFailModal] = useState(false);
  const [failReason, setFailReason] = useState("");

  const isCompleted = currentStep >= STEPS.length;

  function nextStep() {
    if (currentStep < STEPS.length) setCurrentStep((s) => s + 1);
  }

  return (
    <div className="min-h-screen bg-[#020c18]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-6 pb-4">
          <button onClick={() => router.back()} className="h-9 w-9 rounded-xl glass flex items-center justify-center cursor-pointer">
            <ArrowLeft size={16} className="text-slate-400" />
          </button>
          <div>
            <h1 className="text-[16px] font-bold text-white">{ORDER.id}</h1>
            <p className="text-[11px] text-slate-500">Chi tiết chuyến giao</p>
          </div>
        </div>

        <div className="px-4 pb-32 space-y-4">
          {/* Progress steps */}
          <div className="glass-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-4">Tiến trình giao hàng</p>
            <div className="space-y-3">
              {STEPS.map((step, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                        isDone    ? "bg-emerald-500 border-emerald-500" :
                        isActive  ? "bg-cyan-500/20 border-cyan-500" :
                        "bg-white/[0.04] border-slate-700"
                      }`}>
                        {isDone ? <CheckCircle size={14} className="text-white" /> :
                          <span className={`text-[10px] font-bold ${isActive ? "text-cyan-400" : "text-slate-700"}`}>{i+1}</span>
                        }
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`w-0.5 h-6 mt-1 ${isDone ? "bg-emerald-500/50" : "bg-white/[0.06]"}`} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={`text-[13px] font-semibold ${isDone ? "text-emerald-400" : isActive ? "text-white" : "text-slate-600"}`}>
                        {step.label}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${isActive ? "text-slate-400" : "text-slate-700"}`}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sender */}
          <div className="glass-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Người gửi</p>
            <p className="text-[14px] font-semibold text-white mb-1">{ORDER.sender.name}</p>
            <p className="text-[12px] text-slate-400 mb-3">{ORDER.sender.address}</p>
            <div className="flex gap-2">
              <a href={`tel:${ORDER.sender.phone}`} className="flex-1 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                <Phone size={13} /> {ORDER.sender.phone}
              </a>
              <button className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center cursor-pointer">
                <Navigation size={14} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Recipient */}
          <div className="glass-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Người nhận</p>
            <p className="text-[14px] font-semibold text-white mb-1">{ORDER.customer.name}</p>
            <p className="text-[12px] text-slate-400 mb-3">{ORDER.customer.address}</p>
            <div className="flex gap-2">
              <a href={`tel:${ORDER.customer.phone}`} className="flex-1 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                <Phone size={13} /> {ORDER.customer.phone}
              </a>
              <button className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center cursor-pointer">
                <Navigation size={14} className="text-slate-400" />
              </button>
              <button className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center cursor-pointer">
                <MessageCircle size={14} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Order items */}
          <div className="glass-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Hàng hoá</p>
            <div className="space-y-2 mb-3">
              {ORDER.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <p className="text-[13px] text-slate-300">{item.name}</p>
                  <p className="text-[12px] text-slate-500">x{item.qty}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem" }}>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-slate-500">Trọng lượng</span>
                <span className="text-slate-300">{ORDER.weight} kg</span>
              </div>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-slate-500">Phí vận chuyển</span>
                <span className="text-slate-300">₫{ORDER.fee.toLocaleString()}</span>
              </div>
              {ORDER.cod > 0 && (
                <div className="flex justify-between text-[12px]">
                  <span className="text-emerald-400 font-semibold">Thu hộ COD</span>
                  <span className="text-emerald-400 font-bold">₫{ORDER.cod.toLocaleString()}</span>
                </div>
              )}
            </div>
            {ORDER.note && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/10">
                <p className="text-[11px] text-amber-400/80">📝 {ORDER.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom actions */}
        {!isCompleted && (
          <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4" style={{ background: "rgba(2,12,24,0.97)", borderTop: "1px solid rgba(56,189,248,0.08)", backdropFilter: "blur(20px)" }}>
            <div className="max-w-md mx-auto flex gap-3">
              <button
                onClick={() => setFailModal(true)}
                className="h-12 px-4 rounded-2xl text-rose-400 border border-rose-500/20 bg-rose-500/10 text-[13px] font-semibold hover:bg-rose-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <AlertCircle size={15} /> Thất bại
              </button>
              <button
                onClick={nextStep}
                className="flex-1 h-12 rounded-2xl text-white text-[14px] font-bold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)", boxShadow: "0 4px 20px -4px rgba(14,165,233,0.5)" }}
              >
                {currentStep === 0 ? <><Package size={16} /> Xác nhận lấy hàng</> :
                 currentStep === 1 ? <><Truck size={16} /> Bắt đầu giao</> :
                 currentStep === 2 ? <><Camera size={16} /> Chụp xác nhận giao</> :
                 <><CheckCircle size={16} /> Hoàn thành</>}
              </button>
            </div>
          </div>
        )}

        {/* Success state */}
        {isCompleted && (
          <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4" style={{ background: "rgba(2,12,24,0.97)", borderTop: "1px solid rgba(52,211,153,0.2)", backdropFilter: "blur(20px)" }}>
            <div className="max-w-md mx-auto text-center">
              <p className="text-emerald-400 font-bold text-[15px] mb-1">✅ Giao hàng thành công!</p>
              <p className="text-slate-500 text-[12px]">Bạn đã hoàn thành đơn {ORDER.id}</p>
            </div>
          </div>
        )}
      </div>

      {/* Fail modal */}
      {failModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setFailModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-t-3xl p-6"
            style={{ background: "rgba(8,18,38,0.98)", border: "1px solid rgba(239,68,68,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[16px] font-bold text-white mb-4">Lý do thất bại</h3>
            <div className="space-y-2 mb-4">
              {["Người nhận không có mặt", "Sai địa chỉ", "Người nhận từ chối nhận", "Không liên lạc được", "Lý do khác"].map((r) => (
                <button
                  key={r}
                  onClick={() => setFailReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[13px] transition-all cursor-pointer border ${
                    failReason === r
                      ? "bg-rose-500/15 border-rose-500/25 text-rose-300"
                      : "bg-white/[0.03] border-white/[0.06] text-slate-400 hover:bg-white/[0.06]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              disabled={!failReason}
              onClick={() => setFailModal(false)}
              className="w-full h-12 rounded-2xl text-white text-[14px] font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
            >
              Xác nhận thất bại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
