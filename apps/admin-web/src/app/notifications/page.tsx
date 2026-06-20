"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout";
import { Bell, BellOff, Send, Users, Package, AlertTriangle, Info, CheckCircle, Trash2 } from "lucide-react";

type NotifType = "system" | "order" | "alert" | "info";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotifType;
  target: string;
  sentAt: string;
  readCount: number;
  totalTarget: number;
}

const NOTIFICATIONS: Notification[] = [
  { id: "N001", title: "Bảo trì hệ thống", body: "Hệ thống sẽ bảo trì từ 02:00 - 04:00 ngày 16/05/2026. Vui lòng hoàn thành các đơn trước thời gian trên.", type: "system", target: "Tất cả", sentAt: "14/05/2026 18:00", readCount: 2340, totalTarget: 3241 },
  { id: "N002", title: "Khuyến mãi tháng 5", body: "Miễn phí cước phí cho 100 đơn đầu tiên mỗi ngày trong tháng 5. Áp dụng cho tất cả shipper.", type: "info", target: "Shipper", sentAt: "01/05/2026 09:00", readCount: 180, totalTarget: 186 },
  { id: "N003", title: "Cảnh báo: Tải hub HCM-02 vượt ngưỡng", body: "Hub Gò Vấp đang ở mức 98% công suất. Vui lòng điều phối đơn sang hub lân cận.", type: "alert", target: "Ops Manager", sentAt: "14/05/2026 14:30", readCount: 3, totalTarget: 5 },
  { id: "N004", title: "Xác nhận đơn hàng PB-20260002", body: "Đơn hàng của Trần Thị B đã được xác nhận thành công và đang tìm shipper phù hợp.", type: "order", target: "Sender", sentAt: "14/05/2026 09:05", readCount: 1, totalTarget: 1 },
  { id: "N005", title: "Cập nhật chính sách COD", body: "Giới hạn COD tối đa được nâng lên ₫15,000,000 từ ngày 15/05/2026. Chi tiết xem tại trang Cấu hình.", type: "system", target: "Tất cả", sentAt: "13/05/2026 08:00", readCount: 1980, totalTarget: 3241 },
];

const TYPE_CONFIG: Record<NotifType, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  system: { label: "Hệ thống", icon: Bell,          color: "text-indigo-400", bg: "bg-indigo-500/10",  border: "border-indigo-500/15" },
  order:  { label: "Đơn hàng", icon: Package,       color: "text-sky-400",    bg: "bg-sky-500/10",     border: "border-sky-500/15" },
  alert:  { label: "Cảnh báo", icon: AlertTriangle, color: "text-amber-400",  bg: "bg-amber-500/10",   border: "border-amber-500/15" },
  info:   { label: "Thông tin", icon: Info,          color: "text-emerald-400",bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
};

const TARGET_OPTIONS = ["Tất cả", "Shipper", "Driver", "Sender", "Ops Manager"];

export default function NotificationsPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [sendModal, setSendModal] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", type: "info" as NotifType, target: "Tất cả" });

  const filtered = typeFilter === "all"
    ? NOTIFICATIONS
    : NOTIFICATIONS.filter((n) => n.type === typeFilter);

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Quản lý thông báo</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Gửi và theo dõi thông báo đến người dùng hệ thống</p>
          </div>
          <button
            onClick={() => setSendModal(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer"
          >
            <Send size={14} /> Gửi thông báo
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 stagger">
          {[
            { label: "Tổng đã gửi", value: NOTIFICATIONS.length.toString(), icon: Bell, color: "text-indigo-400", bg: "bg-indigo-500/[0.08]" },
            { label: "Cảnh báo chưa đọc", value: "1", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/[0.08]" },
            { label: "Tổng người nhận", value: "3.2k", icon: Users, color: "text-sky-400", bg: "bg-sky-500/[0.08]" },
            { label: "Tỷ lệ đọc TB", value: "68%", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/[0.08]" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
                <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={s.color} />
                </div>
                <div>
                  <p className="text-[22px] font-bold text-white leading-none">{s.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Type filter */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { key: "all", label: "Tất cả" },
            { key: "system", label: "Hệ thống" },
            { key: "order", label: "Đơn hàng" },
            { key: "alert", label: "Cảnh báo" },
            { key: "info", label: "Thông tin" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTypeFilter(t.key)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                typeFilter === t.key
                  ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                  : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          {filtered.map((notif) => {
            const tc = TYPE_CONFIG[notif.type];
            const Icon = tc.icon;
            const readPct = Math.round((notif.readCount / notif.totalTarget) * 100);
            return (
              <div key={notif.id} className="glass rounded-2xl p-5 hover:border-white/[0.10] transition-all duration-200">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tc.bg} border ${tc.border}`}>
                    <Icon size={16} className={tc.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h4 className="text-[14px] font-semibold text-white">{notif.title}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${tc.bg} ${tc.color} border ${tc.border}`}>
                        {tc.label}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-400 leading-relaxed mb-3">{notif.body}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <Users size={10} /> {notif.target}
                      </span>
                      <span className="text-[11px] text-slate-600">{notif.sentAt}</span>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-[11px] text-slate-600">{notif.readCount}/{notif.totalTarget} đã đọc</span>
                        <div className="w-20 h-1.5 rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${readPct}%`,
                              background: readPct >= 70 ? "#34d399" : readPct >= 40 ? "#fbbf24" : "#6366f1",
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500">{readPct}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/[0.06] transition-all cursor-pointer flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Send notification modal */}
      {sendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSendModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fadeIn"
            style={{ background: "rgba(10,14,35,0.97)", border: "1px solid rgba(255,255,255,0.09)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center">
                <Send size={15} className="text-white" />
              </div>
              <h2 className="text-[16px] font-semibold text-white">Gửi thông báo mới</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Tiêu đề</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nhập tiêu đề thông báo..."
                  className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 text-[13px] text-white placeholder-slate-600 outline-none focus:border-indigo-500/40 transition-all"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Nội dung</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Nhập nội dung thông báo..."
                  rows={3}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 py-2.5 text-[13px] text-white placeholder-slate-600 outline-none focus:border-indigo-500/40 transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Loại</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as NotifType })}
                    className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 text-[13px] text-white outline-none focus:border-indigo-500/40 cursor-pointer"
                  >
                    <option value="info">Thông tin</option>
                    <option value="system">Hệ thống</option>
                    <option value="order">Đơn hàng</option>
                    <option value="alert">Cảnh báo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Đối tượng</label>
                  <select
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value })}
                    className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 text-[13px] text-white outline-none focus:border-indigo-500/40 cursor-pointer"
                  >
                    {TARGET_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSendModal(false)}
                  className="flex-1 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-slate-400 hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setSendModal(false)}
                  className="flex-1 h-10 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send size={13} /> Gửi ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
