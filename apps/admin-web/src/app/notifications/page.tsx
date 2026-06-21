"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/layout";
import {
  Bell, Send, Package, AlertTriangle, Info, CheckCircle,
  Loader, Wallet, Clock, X, RefreshCw, Users,
} from "lucide-react";
import {
  getUserNotifications, getPendingTopUps, updateTopUpStatus, adminCreditWallet, getAllUsers,
} from "@picbox/utils";
import type { NotificationItem, TopUpRequest, AdminUser } from "@picbox/utils";

// ─── Notification helpers ─────────────────────────────────────────────────────

type NotifType = "ORDER_CREATED" | "ORDER_STATUS_CHANGED" | "ORDER_CANCELLED" | "PAYMENT_SUCCESS" | "GENERIC";

const NOTIF_CFG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  ORDER_CREATED:        { label: "Đơn mới",    icon: Package,       color: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/15" },
  ORDER_STATUS_CHANGED: { label: "Cập nhật",   icon: Bell,          color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/15" },
  ORDER_CANCELLED:      { label: "Huỷ đơn",    icon: X,             color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/15" },
  PAYMENT_SUCCESS:      { label: "Thanh toán", icon: CheckCircle,   color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
  GENERIC:              { label: "Hệ thống",   icon: Info,          color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/15" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    + " " + d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

function getAdminId(): string {
  try {
    const u = JSON.parse(localStorage.getItem("user") ?? "{}");
    return u.id ?? "";
  } catch { return ""; }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [tab, setTab] = useState<"notif" | "topup">("notif");

  // ── Notifications ──
  const [notifs, setNotifs]         = useState<NotificationItem[]>([]);
  const [nLoading, setNLoading]     = useState(true);

  // ── TopUp approvals ──
  const [topups, setTopups]         = useState<TopUpRequest[]>([]);
  const [users, setUsers]           = useState<AdminUser[]>([]);
  const [approving, setApproving]   = useState<string | null>(null);
  const [tError, setTError]         = useState<Record<string, string>>({});

  // ── Send notification modal (cosmetic) ──
  const [sendModal, setSendModal]   = useState(false);
  const [form, setForm]             = useState({ title: "", body: "", type: "info", target: "Tất cả" });

  const loadNotifs = useCallback(async () => {
    setNLoading(true);
    const adminId = getAdminId();
    const data = adminId ? await getUserNotifications(adminId) : [];
    setNotifs(data);
    setNLoading(false);
  }, []);

  const loadTopups = useCallback(() => {
    setTopups(getPendingTopUps());
  }, []);

  useEffect(() => {
    loadNotifs();
    loadTopups();
    getAllUsers().then(setUsers).catch(() => {});
  }, [loadNotifs, loadTopups]);

  const handleApprove = async (req: TopUpRequest) => {
    setApproving(req.id);
    setTError(prev => ({ ...prev, [req.id]: "" }));
    try {
      await adminCreditWallet(req.userId, req.amount, `Admin duyệt nạp tiền — ${req.note ?? "Chuyển khoản"}`);
      updateTopUpStatus(req.id, "APPROVED");
      setTopups(getPendingTopUps());
    } catch (e) {
      setTError(prev => ({ ...prev, [req.id]: (e as Error).message }));
    } finally {
      setApproving(null);
    }
  };

  const handleReject = (id: string) => {
    updateTopUpStatus(id, "REJECTED");
    setTopups(getPendingTopUps());
  };

  const pendingCount = topups.filter(t => t.status === "PENDING").length;

  return (
    <AdminLayout>
      <div className="space-y-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[18px] font-bold text-white">Thông báo & Duyệt nạp tiền</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">Theo dõi thông báo hệ thống và duyệt yêu cầu nạp ví</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Tải lại"
              onClick={() => { loadNotifs(); loadTopups(); }}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
            </button>
            <button
              type="button"
              onClick={() => setSendModal(true)}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer"
            >
              <Send size={14} /> Gửi thông báo
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setTab("notif")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all border cursor-pointer ${
              tab === "notif"
                ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
            }`}
          >
            <Bell size={12} /> Thông báo hệ thống
            {notifs.length > 0 && (
              <span className="ml-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded-md font-semibold">
                {notifs.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab("topup")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all border cursor-pointer ${
              tab === "topup"
                ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
            }`}
          >
            <Wallet size={12} /> Duyệt nạp tiền
            {pendingCount > 0 && (
              <span className="ml-0.5 bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-md font-semibold">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* ── TAB: THÔNG BÁO ── */}
        {tab === "notif" && (
          <div className="space-y-3">
            {nLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader size={16} className="text-indigo-400 animate-spin" />
                <span className="ml-2 text-[13px] text-slate-500">Đang tải thông báo...</span>
              </div>
            ) : notifs.length === 0 ? (
              <div className="glass rounded-xl py-14 text-center">
                <Bell size={32} className="text-slate-700 mx-auto mb-2" />
                <p className="text-[13px] text-slate-600">Chưa có thông báo nào</p>
                <p className="text-[12px] text-slate-700 mt-1">Thông báo sẽ xuất hiện khi có sự kiện đơn hàng hoặc thanh toán</p>
              </div>
            ) : (
              notifs.map(n => {
                const cfg = NOTIF_CFG[n.type as NotifType] ?? NOTIF_CFG.GENERIC;
                const Icon = cfg.icon;
                return (
                  <div key={n.id} className="glass rounded-xl p-4 hover:border-white/[0.10] transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                        <Icon size={15} className={cfg.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h4 className="text-[13px] font-semibold text-white">{n.subject}</h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-[12px] text-slate-400 leading-relaxed mb-2">{n.body}</p>
                        <p className="text-[11px] text-slate-600">{formatDate(n.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── TAB: DUYỆT NẠP TIỀN ── */}
        {tab === "topup" && (
          <div className="space-y-3">
            {topups.length === 0 ? (
              <div className="glass rounded-xl py-14 text-center">
                <Wallet size={32} className="text-slate-700 mx-auto mb-2" />
                <p className="text-[13px] text-slate-600">Chưa có yêu cầu nạp tiền nào</p>
                <p className="text-[12px] text-slate-700 mt-1">Yêu cầu sẽ xuất hiện khi người dùng nhấn &quot;Tôi đã chuyển khoản&quot;</p>
              </div>
            ) : (
              topups.map(req => {
                const userInfo = users.find(u => u.id === req.userId);
                const isPending = req.status === "PENDING";
                const isApproving = approving === req.id;
                return (
                  <div
                    key={req.id}
                    className={`glass rounded-xl p-4 transition-all border ${
                      isPending
                        ? "border-amber-500/20"
                        : req.status === "APPROVED"
                          ? "border-emerald-500/15 opacity-70"
                          : "border-rose-500/15 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isPending ? "bg-amber-500/10 border border-amber-500/20" : "bg-white/[0.04] border border-white/[0.06]"
                      }`}>
                        {isPending
                          ? <Clock size={16} className="text-amber-400" />
                          : req.status === "APPROVED"
                            ? <CheckCircle size={16} className="text-emerald-400" />
                            : <X size={16} className="text-rose-400" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div>
                            <p className="text-[13px] font-semibold text-white">
                              {req.userName}
                              {userInfo && (
                                <span className="text-[11px] text-slate-500 ml-1.5 font-normal">
                                  ({userInfo.username})
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-600 font-mono mt-0.5">{req.userId}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[16px] font-bold text-white">{formatMoney(req.amount)}</p>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                              isPending
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                                : req.status === "APPROVED"
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                            }`}>
                              {isPending ? "Chờ duyệt" : req.status === "APPROVED" ? "Đã duyệt" : "Từ chối"}
                            </span>
                          </div>
                        </div>

                        {req.note && (
                          <p className="text-[12px] text-slate-400 mb-2">Ghi chú: {req.note}</p>
                        )}
                        <p className="text-[11px] text-slate-600 mb-3">{formatDate(req.createdAt)}</p>

                        {tError[req.id] && (
                          <p className="text-[11px] text-rose-400 mb-2">{tError[req.id]}</p>
                        )}

                        {isPending && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(req)}
                              disabled={isApproving}
                              className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[12px] font-semibold hover:bg-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {isApproving ? (
                                <><Loader size={12} className="animate-spin" /> Đang duyệt...</>
                              ) : (
                                <><CheckCircle size={12} /> Duyệt & Cộng tiền</>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(req.id)}
                              disabled={isApproving}
                              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/15 text-[12px] font-medium hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
                            >
                              <X size={12} /> Từ chối
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
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
              <h2 className="text-[14px] font-semibold text-white">Gửi thông báo mới</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Tiêu đề</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nhập tiêu đề thông báo..."
                  className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 text-[13px] text-white placeholder-slate-600 outline-none focus:border-indigo-500/40"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Nội dung</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Nhập nội dung thông báo..."
                  rows={3}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 py-2.5 text-[13px] text-white placeholder-slate-600 outline-none focus:border-indigo-500/40 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Loại</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 text-[13px] text-white outline-none focus:border-indigo-500/40 cursor-pointer"
                  >
                    <option value="info">Thông tin</option>
                    <option value="system">Hệ thống</option>
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
                    {["Tất cả", "Shipper", "Driver", "Sender", "Ops Manager"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 flex items-center gap-1">
                <Users size={11} /> Tính năng gửi thông báo đang trong giai đoạn phát triển
              </p>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSendModal(false)}
                  className="flex-1 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-slate-400 hover:bg-white/[0.06] cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => setSendModal(false)}
                  className="flex-1 h-10 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 cursor-pointer flex items-center justify-center gap-2"
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
