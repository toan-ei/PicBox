"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Phone, MapPin, Package, MessageCircle,
  CheckCircle, Camera, AlertCircle, ChevronRight,
  Navigation, Copy, Truck, DollarSign, Weight, Clock,
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
  createdAt: "14/05/2026 · 08:45",
};

const STEPS = [
  { key: "picking",    label: "Đang lấy hàng",   desc: "Đến điểm gửi lấy đơn", icon: Package },
  { key: "picked",     label: "Đã lấy hàng",      desc: "Đã nhận hàng, đang di chuyển", icon: CheckCircle },
  { key: "delivering", label: "Đang giao",         desc: "Đến địa chỉ người nhận", icon: Truck },
  { key: "delivered",  label: "Giao thành công",   desc: "Người nhận đã ký xác nhận", icon: Camera },
];

export default function DeliveryDetailPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [failModal, setFailModal] = useState(false);
  const [failReason, setFailReason] = useState("");
  const [copied, setCopied] = useState("");

  const isCompleted = currentStep >= STEPS.length;

  function nextStep() {
    if (currentStep < STEPS.length) setCurrentStep((s) => s + 1);
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="min-h-screen bg-[#020c18]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-6 pb-4 animate-fadeIn">
          <button onClick={() => router.back()} className="h-10 w-10 rounded-xl glass flex items-center justify-center cursor-pointer press-effect">
            <ArrowLeft size={16} className="text-slate-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-bold text-white">{ORDER.id}</h1>
            <p className="text-[11px] text-slate-500">Tạo lúc {ORDER.createdAt}</p>
          </div>
          {/* Quick actions */}
          <button
            onClick={() => copyToClipboard(ORDER.id, "id")}
            className="h-10 w-10 rounded-xl glass flex items-center justify-center cursor-pointer press-effect"
          >
            {copied === "id" ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-500" />}
          </button>
        </div>

        <div className="px-4 pb-32 space-y-4">
          {/* Progress steps */}
          <div className="glass-card p-5 animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Tiến trình giao hàng</p>
              <span className="text-[11px] font-semibold text-cyan-400">{Math.min(currentStep + 1, STEPS.length)}/{STEPS.length}</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-white/[0.06] mb-5">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(currentStep / STEPS.length) * 100}%`,
                  background: isCompleted
                    ? "linear-gradient(90deg, #34d399, #6ee7b7)"
                    : "linear-gradient(90deg, #0ea5e9, #06b6d4)",
                  boxShadow: `0 0 10px ${isCompleted ? "rgba(52,211,153,0.4)" : "rgba(14,165,233,0.4)"}`,
                }}
              />
            </div>

            <div className="space-y-0">
              {STEPS.map((step, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                const StepIcon = step.icon;
                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 ${
                        isDone    ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20" :
                        isActive  ? "bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/20" :
                        "bg-white/[0.04] border-slate-700"
                      }`}>
                        {isDone ? <CheckCircle size={15} className="text-white" /> :
                         isActive ? <StepIcon size={14} className="text-cyan-400 animate-bounce-subtle" /> :
                          <span className={`text-[10px] font-bold text-slate-700`}>{i+1}</span>
                        }
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`w-0.5 h-7 mt-1 transition-all duration-500 ${isDone ? "bg-emerald-500/50" : "bg-white/[0.06]"}`} />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <p className={`text-[13px] font-semibold transition-colors ${isDone ? "text-emerald-400" : isActive ? "text-white" : "text-slate-600"}`}>
                        {step.label}
                      </p>
                      <p className={`text-[11px] mt-0.5 transition-colors ${isActive ? "text-slate-400" : "text-slate-700"}`}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sender */}
          <div className="glass-card p-4 animate-fadeIn" style={{ animationDelay: "100ms" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Người gửi</p>
            <div className="flex items-start gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-white">{ORDER.sender.name}</p>
                <p className="text-[12px] text-slate-400 mt-0.5">{ORDER.sender.address}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${ORDER.sender.phone}`} className="flex-1 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 text-[12px] font-semibold flex items-center justify-center gap-2 cursor-pointer press-effect">
                <Phone size={14} /> {ORDER.sender.phone}
              </a>
              <button className="h-11 w-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center cursor-pointer press-effect">
                <Navigation size={15} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Recipient */}
          <div className="glass-card p-4 animate-fadeIn" style={{ animationDelay: "200ms" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Người nhận</p>
            <div className="flex items-start gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-white">{ORDER.customer.name}</p>
                <p className="text-[12px] text-slate-400 mt-0.5">{ORDER.customer.address}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${ORDER.customer.phone}`} className="flex-1 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 text-[12px] font-semibold flex items-center justify-center gap-2 cursor-pointer press-effect">
                <Phone size={14} /> {ORDER.customer.phone}
              </a>
              <button className="h-11 w-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center cursor-pointer press-effect">
                <Navigation size={15} className="text-slate-400" />
              </button>
              <button className="h-11 w-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center cursor-pointer press-effect">
                <MessageCircle size={15} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Order items */}
          <div className="glass-card p-4 animate-fadeIn" style={{ animationDelay: "300ms" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Hàng hoá</p>
            <div className="space-y-2 mb-4">
              {ORDER.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Package size={12} className="text-cyan-400" />
                    </div>
                    <p className="text-[13px] text-slate-300">{item.name}</p>
                  </div>
                  <p className="text-[12px] text-slate-500 font-semibold">x{item.qty}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-500 flex items-center gap-1.5"><Clock size={11} /> Trọng lượng</span>
                <span className="text-slate-300 font-medium">{ORDER.weight} kg</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-500 flex items-center gap-1.5"><DollarSign size={11} /> Phí vận chuyển</span>
                <span className="text-slate-300 font-medium">₫{ORDER.fee.toLocaleString()}</span>
              </div>
              {ORDER.cod > 0 && (
                <div className="flex justify-between text-[13px] pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <DollarSign size={13} /> Thu hộ COD
                  </span>
                  <span className="text-emerald-400 font-bold text-[14px]">₫{ORDER.cod.toLocaleString()}</span>
                </div>
              )}
            </div>
            {ORDER.note && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/10">
                <p className="text-[12px] text-amber-400/80 leading-relaxed">📝 {ORDER.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom actions */}
        {!isCompleted && (
          <div className="fixed bottom-0 left-0 right-0 px-4 pt-4 animate-slideUp"
            style={{
              background: "rgba(2,12,24,0.97)",
              borderTop: "1px solid rgba(56,189,248,0.08)",
              backdropFilter: "blur(20px)",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}>
            <div className="max-w-md mx-auto flex gap-3">
              <button
                onClick={() => setFailModal(true)}
                className="h-13 px-5 rounded-2xl text-rose-400 border border-rose-500/20 bg-rose-500/10 text-[13px] font-semibold hover:bg-rose-500/20 transition-all cursor-pointer press-effect flex items-center gap-2"
              >
                <AlertCircle size={16} /> Thất bại
              </button>
              <button
                onClick={nextStep}
                className="flex-1 h-13 rounded-2xl text-white text-[14px] font-bold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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
          <div className="fixed bottom-0 left-0 right-0 px-4 pt-4 animate-fadeInScale"
            style={{
              background: "rgba(2,12,24,0.97)",
              borderTop: "1px solid rgba(52,211,153,0.2)",
              backdropFilter: "blur(20px)",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}>
            <div className="max-w-md mx-auto text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 font-bold text-[16px]">Giao hàng thành công!</p>
                <p className="text-slate-500 text-[12px] mt-0.5">Bạn đã hoàn thành đơn {ORDER.id}</p>
              </div>
              <button
                onClick={() => router.push("/")}
                className="w-full h-12 rounded-2xl text-white text-[13px] font-bold cursor-pointer press-effect"
                style={{ background: "linear-gradient(135deg, #10b981, #34d399)", boxShadow: "0 4px 16px -4px rgba(16,185,129,0.4)" }}
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fail modal */}
      {failModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setFailModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-t-3xl p-6 animate-slideUp"
            style={{ background: "rgba(8,18,38,0.98)", border: "1px solid rgba(239,68,68,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto mb-5" />
            
            <h3 className="text-[16px] font-bold text-white mb-4">Lý do thất bại</h3>
            <div className="space-y-2 mb-5">
              {["Người nhận không có mặt", "Sai địa chỉ", "Người nhận từ chối nhận", "Không liên lạc được", "Lý do khác"].map((r) => (
                <button
                  key={r}
                  onClick={() => setFailReason(r)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-[13px] transition-all cursor-pointer border press-effect ${
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
              className="w-full h-13 rounded-2xl text-white text-[14px] font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all press-effect"
              style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
            >
              Xác nhận thất bại
            </button>
            <button
              onClick={() => setFailModal(false)}
              className="w-full h-10 mt-2 text-[13px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Huỷ bỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
