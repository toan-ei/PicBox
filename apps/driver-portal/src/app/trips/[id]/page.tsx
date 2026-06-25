"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Truck, Package, Clock, CheckCircle,
  AlertTriangle, Loader, ChevronRight,
} from "lucide-react";
import { getAdminOrder, updateOrderStatus } from "@picbox/utils";
import type { AdminOrder } from "@picbox/utils";

const NEXT_STATUSES: Record<string, string[]> = {
  AT_ORIGIN_BRANCH:          ["IN_TRANSIT_TO_HUB"],
  IN_TRANSIT_TO_HUB:         ["AT_HUB"],
  AT_HUB:                    ["IN_TRANSIT_TO_DEST_HUB", "IN_TRANSIT_TO_DEST_BRANCH"],
  IN_TRANSIT_TO_DEST_HUB:    ["AT_DEST_HUB"],
  AT_DEST_HUB:               ["IN_TRANSIT_TO_DEST_BRANCH"],
  IN_TRANSIT_TO_DEST_BRANCH: ["AT_DEST_BRANCH"],
};

const STATUS_INFO: Record<string, { label: string; color: string; bg: string; border: string; action: string }> = {
  AT_ORIGIN_BRANCH:          { label: "Chờ lấy hàng tại CN gốc",        color: "text-slate-300",   bg: "bg-slate-500/10",   border: "border-slate-500/15",   action: "Lấy hàng, đưa lên xe" },
  IN_TRANSIT_TO_HUB:         { label: "Đang vận chuyển đến Hub",          color: "text-cyan-300",    bg: "bg-cyan-500/10",    border: "border-cyan-500/15",    action: "Xác nhận đã đến Hub" },
  AT_HUB:                    { label: "Tại Hub, chờ phân loại",           color: "text-blue-300",    bg: "bg-blue-500/10",    border: "border-blue-500/15",    action: "Chuyển tiếp" },
  IN_TRANSIT_TO_DEST_HUB:    { label: "Hub → Hub đích",                   color: "text-indigo-300",  bg: "bg-indigo-500/10",  border: "border-indigo-500/15",  action: "Xác nhận đến Hub đích" },
  AT_DEST_HUB:               { label: "Tại Hub đích, chờ xuất phát",      color: "text-violet-300",  bg: "bg-violet-500/10",  border: "border-violet-500/15",  action: "Chuyển sang CN đích" },
  IN_TRANSIT_TO_DEST_BRANCH: { label: "Đang vận chuyển đến CN đích",      color: "text-sky-300",     bg: "bg-sky-500/10",     border: "border-sky-500/15",     action: "Xác nhận đến CN đích" },
  AT_DEST_BRANCH:            { label: "Đã đến CN đích, bàn giao Shipper", color: "text-teal-300",    bg: "bg-teal-500/10",    border: "border-teal-500/15",    action: "Đã bàn giao" },
};

const NEXT_LABEL: Record<string, string> = {
  IN_TRANSIT_TO_HUB:         "Đang vận chuyển đến Hub",
  AT_HUB:                    "Đã đến Hub",
  IN_TRANSIT_TO_DEST_HUB:    "Vận chuyển Hub → Hub",
  IN_TRANSIT_TO_DEST_BRANCH: "Vận chuyển đến CN đích",
  AT_DEST_HUB:               "Đã đến Hub đích",
  AT_DEST_BRANCH:            "Đã đến CN đích (bàn giao Shipper)",
};

// Workflow steps for visual progress
const WORKFLOW = [
  "AT_ORIGIN_BRANCH",
  "IN_TRANSIT_TO_HUB",
  "AT_HUB",
  "IN_TRANSIT_TO_DEST_BRANCH",
  "AT_DEST_BRANCH",
];
const WORKFLOW_LABELS: Record<string, string> = {
  AT_ORIGIN_BRANCH:          "Tại CN gốc",
  IN_TRANSIT_TO_HUB:         "Đến Hub",
  AT_HUB:                    "Tại Hub",
  IN_TRANSIT_TO_DEST_BRANCH: "Đến CN đích",
  AT_DEST_BRANCH:            "Bàn giao",
};

function getWorkflowStep(status: string): number {
  // Hub→Hub is between AT_HUB and IN_TRANSIT_TO_DEST_BRANCH
  const map: Record<string, number> = {
    AT_ORIGIN_BRANCH: 0,
    IN_TRANSIT_TO_HUB: 1,
    AT_HUB: 2,
    IN_TRANSIT_TO_DEST_HUB: 2,
    AT_DEST_HUB: 2,
    IN_TRANSIT_TO_DEST_BRANCH: 3,
    AT_DEST_BRANCH: 4,
  };
  return map[status] ?? -1;
}

export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder]     = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [nextStatus, setNextStatus] = useState("");
  const [sosModal, setSosModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    getAdminOrder(orderId)
      .then((o) => {
        setOrder(o);
        const next = NEXT_STATUSES[o.backendStatus];
        if (next?.length === 1) setNextStatus(next[0]);
      })
      .catch(() => setError("Không tìm thấy đơn hàng"))
      .finally(() => setLoading(false));
  }, [orderId]);

  async function handleAdvance() {
    if (!order || !nextStatus) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, nextStatus);
      setOrder(prev => prev ? { ...prev, backendStatus: nextStatus } : prev);
      const next = NEXT_STATUSES[nextStatus];
      setNextStatus(next?.length === 1 ? next[0] : "");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020f0a] flex items-center justify-center">
        <Loader size={24} className="text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#020f0a] flex flex-col items-center justify-center gap-4 px-4">
        <Package size={40} className="text-slate-700" />
        <p className="text-slate-500 text-[14px]">{error || "Không tìm thấy đơn hàng"}</p>
        <button type="button" onClick={() => router.back()} className="text-emerald-400 text-[13px]">← Quay lại</button>
      </div>
    );
  }

  const info = STATUS_INFO[order.backendStatus];
  const nextList = NEXT_STATUSES[order.backendStatus] ?? [];
  const workflowStep = getWorkflowStep(order.backendStatus);
  const isCompleted = order.backendStatus === "AT_DEST_BRANCH";

  return (
    <div className="min-h-screen bg-[#020f0a]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-6 pb-4 animate-fadeIn">
          <button type="button" onClick={() => router.back()} className="h-10 w-10 rounded-xl glass flex items-center justify-center cursor-pointer press-effect">
            <ArrowLeft size={16} className="text-slate-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-[17px] font-bold text-white">{order.trackingCode}</h1>
            <p className="text-[11px] text-slate-500">Chi tiết kiện hàng</p>
          </div>
          <button
            type="button"
            onClick={() => setSosModal(true)}
            className="h-10 w-10 rounded-xl flex items-center justify-center cursor-pointer press-effect"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
          >
            <AlertTriangle size={16} className="text-rose-400" />
          </button>
        </div>

        <div className="px-4 pb-32 space-y-4">
          {/* Current status */}
          <div className="glass-card p-5 animate-slideUp">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Trạng thái hiện tại</p>
            {info && (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${info.bg} ${info.border}`}>
                <Truck size={16} className={info.color} />
                <span className={`text-[13px] font-semibold ${info.color}`}>{info.label}</span>
              </div>
            )}

            {/* Workflow progress */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                {WORKFLOW.map((step, i) => {
                  const done = i < workflowStep;
                  const active = i === workflowStep;
                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center gap-1">
                        <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          done   ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30" :
                          active ? "bg-emerald-500/20 border-emerald-500" :
                          "bg-white/[0.03] border-slate-700"
                        }`}>
                          {done
                            ? <CheckCircle size={13} className="text-white" />
                            : active
                              ? <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                              : <div className="h-2 w-2 rounded-full bg-slate-700" />
                          }
                        </div>
                        <span className={`text-[9px] font-semibold text-center max-w-[48px] leading-tight ${
                          done ? "text-emerald-500" : active ? "text-emerald-400" : "text-slate-700"
                        }`}>
                          {WORKFLOW_LABELS[step]}
                        </span>
                      </div>
                      {i < WORKFLOW.length - 1 && (
                        <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < workflowStep ? "bg-emerald-500/40" : "bg-slate-800"}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Route info */}
          <div className="glass-card p-4 animate-fadeIn">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Tuyến đường</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-bold text-emerald-400">A</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{order.originBranchName || "Chi nhánh gốc"}</p>
                  <p className="text-[10px] text-slate-500">Điểm xuất phát</p>
                </div>
              </div>
              <div className="ml-3.5 flex items-center gap-2">
                <div className="w-px h-5 bg-slate-700" />
                <ChevronRight size={12} className="text-slate-600" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-bold text-sky-400">B</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{order.destBranchName || "Chi nhánh đích"}</p>
                  <p className="text-[10px] text-slate-500">Điểm đến</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order info */}
          <div className="glass-card p-4 animate-fadeIn">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Thông tin đơn hàng</p>
            <div className="space-y-2.5 text-[13px]">
              {[
                { label: "Người gửi",   value: `${order.senderName} · ${order.senderPhone}` },
                { label: "Người nhận",  value: `${order.receiverName} · ${order.receiverPhone}` },
                { label: "Địa chỉ",    value: order.receiverAddress },
                { label: "COD",        value: order.codAmount > 0 ? `₫${order.codAmount.toLocaleString()}` : "Không có" },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4">
                  <span className="text-slate-600 shrink-0">{row.label}</span>
                  <span className="text-slate-300 text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next status selection (only if multiple options) */}
          {nextList.length > 1 && (
            <div className="glass-card p-4 animate-fadeIn">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-3">Chọn bước tiếp theo</p>
              <div className="space-y-2">
                {nextList.map((ns) => (
                  <button
                    key={ns}
                    type="button"
                    onClick={() => setNextStatus(ns)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[13px] transition-all cursor-pointer border flex items-center gap-3 ${
                      nextStatus === ns
                        ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-300"
                        : "bg-white/[0.03] border-white/[0.05] text-slate-400 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      nextStatus === ns ? "border-emerald-400 bg-emerald-500" : "border-slate-600"
                    }`}>
                      {nextStatus === ns && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    {NEXT_LABEL[ns] || ns}
                  </button>
                ))}
              </div>
            </div>
          )}
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
            {isCompleted ? (
              <div className="w-full h-13 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/10">
                <CheckCircle size={16} /> Đã bàn giao Shipper
              </div>
            ) : nextList.length > 0 ? (
              <button
                type="button"
                disabled={!nextStatus || updating}
                onClick={handleAdvance}
                className="w-full h-13 rounded-2xl text-white text-[14px] font-bold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #10b981, #34d399)", boxShadow: "0 4px 20px -4px rgba(16,185,129,0.5)" }}
              >
                {updating
                  ? <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang cập nhật...</>
                  : <><CheckCircle size={16} /> {info?.action || "Xác nhận bước tiếp theo"}</>
                }
              </button>
            ) : (
              <div className="w-full h-13 rounded-2xl flex items-center justify-center text-[14px] text-slate-600 border border-slate-700/50">
                <Clock size={16} className="mr-2" /> Chờ cập nhật từ Ops
              </div>
            )}
          </div>
        </div>
      </div>

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
            <p className="text-[12px] text-slate-500 mb-4">Đơn <span className="text-emerald-400 font-semibold">{order.trackingCode}</span></p>
            <div className="space-y-2 mb-5">
              {[
                { label: "Xe hỏng / hư hại",      icon: "🚛" },
                { label: "Tai nạn giao thông",     icon: "🚨" },
                { label: "Seal bị phá / hàng mất", icon: "📦" },
                { label: "Kẹt đường nghiêm trọng", icon: "🚧" },
                { label: "Vấn đề khác",             icon: "❓" },
              ].map((r) => (
                <button key={r.label} type="button"
                  className="w-full text-left px-4 py-3.5 rounded-xl text-[13px] bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:bg-rose-500/[0.06] hover:border-rose-500/20 hover:text-rose-300 transition-all cursor-pointer press-effect flex items-center gap-3"
                  onClick={() => setSosModal(false)}
                >
                  <span className="text-[16px]">{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setSosModal(false)}
              className="w-full h-10 text-[13px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              Huỷ bỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
