"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, Truck, Clock, CheckCircle, XCircle, Search,
  ChevronRight, LayoutDashboard, MapPin, BarChart3, Activity, Loader, ArrowRight,
} from "lucide-react";
import {
  getAllAdminOrders, getStaffList, assignOrderToShipper, updateOrderStatus,
} from "@picbox/utils";
import { toFrontendStatus } from "@picbox/utils";
import type { AdminOrder, StaffMember } from "@picbox/utils";

function OpsSidebar({ active }: { active: string }) {
  const NAV = [
    { href: "/", icon: LayoutDashboard, label: "Live Monitor" },
    { href: "/orders", icon: Package, label: "Đơn hàng" },
    { href: "/hubs", icon: MapPin, label: "Hub" },
    { href: "/reports", icon: BarChart3, label: "Báo cáo" },
  ];
  return (
    <div className="ops-sidebar">
      <div className="flex items-center gap-3 px-5 h-16" style={{ borderBottom: "1px solid rgba(251,191,36,0.08)" }}>
        <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>
          <Activity size={18} className="text-white" />
        </div>
        <div>
          <p className="text-[14px] font-bold text-white">PicBox Ops</p>
          <p className="text-[10px] text-amber-500/60 font-semibold uppercase tracking-wider">Control Center</p>
        </div>
      </div>
      <nav className="flex-1 px-2.5 py-4 space-y-1">
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = n.href === active;
          return (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all relative ${isActive ? "text-white" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"}`}
              style={isActive ? { background: "linear-gradient(90deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)" } : undefined}
            >
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: "#fbbf24", boxShadow: "0 0 8px rgba(251,191,36,0.5)" }} />}
              <Icon size={16} className={isActive ? "text-amber-400" : ""} />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-2.5 pb-4" style={{ borderTop: "1px solid rgba(251,191,36,0.06)" }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.02] mt-4">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center text-[12px] font-bold text-white" style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>O</div>
          <div>
            <p className="text-[12px] font-semibold text-white">Ops Manager</p>
            <p className="text-[10px] text-slate-500">ops@picbox.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const BACKEND_STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  PENDING:                   { label: "Chờ xử lý",    color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/15" },
  CONFIRMED:                 { label: "Đã xác nhận",  color: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/15" },
  PICKED_UP:                 { label: "Đã lấy hàng",  color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/15" },
  AT_ORIGIN_BRANCH:          { label: "Tại CN gốc",   color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/15" },
  IN_TRANSIT_TO_HUB:         { label: "→ Hub",        color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/15" },
  AT_HUB:                    { label: "Tại Hub",       color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/15" },
  IN_TRANSIT_TO_DEST_HUB:    { label: "Hub → Hub",    color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/15" },
  AT_DEST_HUB:               { label: "Hub đích",     color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/15" },
  IN_TRANSIT_TO_DEST_BRANCH: { label: "→ CN đích",    color: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/15" },
  AT_DEST_BRANCH:            { label: "Tại CN đích",  color: "text-teal-400",    bg: "bg-teal-500/10",    border: "border-teal-500/15" },
  OUT_FOR_DELIVERY:          { label: "Đang giao",    color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/15" },
  DELIVERED:                 { label: "Hoàn thành",   color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
  DELIVERY_FAILED:           { label: "Giao thất bại",color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/15" },
  CANCELLED:                 { label: "Đã huỷ",       color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/15" },
  RETURNED:                  { label: "Hoàn hàng",    color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/15" },
};

const NEXT_STATUSES: Record<string, string[]> = {
  PENDING:                   ["CONFIRMED", "CANCELLED"],
  CONFIRMED:                 ["PICKED_UP", "CANCELLED"],
  PICKED_UP:                 ["AT_ORIGIN_BRANCH"],
  AT_ORIGIN_BRANCH:          ["IN_TRANSIT_TO_HUB"],
  IN_TRANSIT_TO_HUB:         ["AT_HUB"],
  AT_HUB:                    ["IN_TRANSIT_TO_DEST_HUB", "IN_TRANSIT_TO_DEST_BRANCH"],
  IN_TRANSIT_TO_DEST_HUB:    ["AT_DEST_HUB"],
  AT_DEST_HUB:               ["IN_TRANSIT_TO_DEST_BRANCH"],
  IN_TRANSIT_TO_DEST_BRANCH: ["AT_DEST_BRANCH"],
  AT_DEST_BRANCH:            ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY:          ["DELIVERED", "DELIVERY_FAILED"],
  DELIVERY_FAILED:           ["RETURNED"],
};

const TRANSIT_SET = new Set([
  "PICKED_UP","AT_ORIGIN_BRANCH","IN_TRANSIT_TO_HUB","AT_HUB",
  "IN_TRANSIT_TO_DEST_HUB","AT_DEST_HUB","IN_TRANSIT_TO_DEST_BRANCH","AT_DEST_BRANCH",
]);
const FAILED_SET = new Set(["DELIVERY_FAILED","CANCELLED","RETURNED"]);

const FILTER_GROUPS = [
  { key: "all",     label: "Tất cả",      match: (_: string) => true },
  { key: "early",   label: "Chờ xử lý",   match: (s: string) => ["PENDING","CONFIRMED"].includes(s) },
  { key: "transit", label: "Trung chuyển",match: (s: string) => TRANSIT_SET.has(s) },
  { key: "deliver", label: "Đang giao",   match: (s: string) => s === "OUT_FOR_DELIVERY" },
  { key: "done",    label: "Hoàn thành",  match: (s: string) => s === "DELIVERED" },
  { key: "failed",  label: "Thất bại",    match: (s: string) => FAILED_SET.has(s) },
];

function timeSince(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return `${secs}s`;
  if (secs < 3600) return `${Math.floor(secs / 60)}ph`;
  return `${Math.floor(secs / 3600)}h`;
}

export default function OpsOrdersPage() {
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders]             = useState<AdminOrder[]>([]);
  const [shippers, setShippers]         = useState<StaffMember[]>([]);
  const [loading, setLoading]           = useState(true);

  // Assign modal
  const [assignModal, setAssignModal]       = useState<string | null>(null);
  const [selectedShipper, setSelectedShipper] = useState("");
  const [assigning, setAssigning]           = useState(false);
  const [shipperSearch, setShipperSearch]   = useState("");

  // Status update modal
  const [statusModal, setStatusModal]       = useState<{ orderId: string; backendStatus: string } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating]             = useState(false);

  useEffect(() => {
    Promise.all([getAllAdminOrders(), getStaffList("SHIPPER")])
      .then(([o, s]) => { setOrders(o); setShippers(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.trackingCode.toLowerCase().includes(q) ||
      o.receiverName.toLowerCase().includes(q) ||
      (o.destBranchName || "").toLowerCase().includes(q);
    const group = FILTER_GROUPS.find(g => g.key === statusFilter);
    const matchStatus = !group || group.match(o.backendStatus);
    return matchSearch && matchStatus;
  });

  async function handleAssign() {
    if (!assignModal || !selectedShipper) return;
    setAssigning(true);
    try {
      await assignOrderToShipper(assignModal, selectedShipper);
      setOrders(prev => prev.map(o =>
        o.id === assignModal ? { ...o, shipperId: selectedShipper } : o
      ));
      setAssignModal(null);
      setSelectedShipper("");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setAssigning(false);
    }
  }

  async function handleStatusUpdate() {
    if (!statusModal || !selectedStatus) return;
    setUpdating(true);
    try {
      await updateOrderStatus(statusModal.orderId, selectedStatus);
      setOrders(prev => prev.map(o =>
        o.id === statusModal.orderId
          ? { ...o, backendStatus: selectedStatus, status: toFrontendStatus(selectedStatus) }
          : o
      ));
      setStatusModal(null);
      setSelectedStatus("");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUpdating(false);
    }
  }

  const needsAssign = orders.filter(o => !o.shipperId && ["PENDING","CONFIRMED"].includes(o.backendStatus)).length;
  const transitCount = orders.filter(o => TRANSIT_SET.has(o.backendStatus)).length;

  return (
    <div className="min-h-screen bg-[#0c0800]">
      <OpsSidebar active="/orders" />
      <div className="ops-main p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-bold text-white">Quản lý đơn hàng</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Gán shipper và theo dõi toàn bộ vòng đời đơn hàng</p>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-slate-500">
            {needsAssign > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                {needsAssign} đơn cần gán shipper
              </div>
            )}
            {transitCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                {transitCount} đơn đang trung chuyển
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size={24} className="text-amber-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5 stagger">
              {[
                { label: "Tổng đơn",      value: orders.length,                                                             icon: Package,     color: "#6366f1" },
                { label: "Cần gán",        value: orders.filter(o => ["PENDING","CONFIRMED"].includes(o.backendStatus)).length, icon: Clock,    color: "#fbbf24" },
                { label: "Trung chuyển",   value: transitCount,                                                              icon: Truck,       color: "#38bdf8" },
                { label: "Hoàn thành",     value: orders.filter(o => o.backendStatus === "DELIVERED").length,                 icon: CheckCircle, color: "#34d399" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + "15" }}>
                      <Icon size={18} style={{ color: s.color }} />
                    </div>
                    <div>
                      <p className="text-[24px] font-bold text-white leading-none">{s.value}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm mã đơn, khách hàng, khu vực..."
                  className="w-full h-9 rounded-xl pl-9 pr-4 text-[13px] text-slate-300 placeholder-slate-600 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,191,36,0.08)" }}
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {FILTER_GROUPS.map((g) => (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setStatusFilter(g.key)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                      statusFilter === g.key
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                        : "text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(251,191,36,0.06)" }}>
                    {["Mã đơn", "Người nhận", "Khu vực", "Shipper", "COD", "Trạng thái", "Chờ", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-[13px] text-slate-600">Không có đơn nào</td>
                    </tr>
                  )}
                  {filtered.map((o) => {
                    const sc = BACKEND_STATUS_CFG[o.backendStatus] ?? BACKEND_STATUS_CFG["PENDING"];
                    const nextList = NEXT_STATUSES[o.backendStatus] ?? [];
                    return (
                      <tr key={o.id} className="hover:bg-white/[0.015] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td className="px-4 py-3 text-[13px] font-semibold text-white">{o.trackingCode}</td>
                        <td className="px-4 py-3 text-[13px] text-slate-300">{o.receiverName}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-500">{o.destBranchName || o.receiverAddress.split(",")[0]}</td>
                        <td className="px-4 py-3 text-[12px]">
                          {o.shipperId
                            ? <span className="text-slate-300">{shippers.find(s => s.userId === o.shipperId)?.fullName || o.shipperId.slice(0, 8)}</span>
                            : <span className="text-amber-500/60 italic">Chưa gán</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-[12px]">
                          {o.codAmount > 0
                            ? <span className="text-emerald-400 font-semibold">₫{o.codAmount.toLocaleString()}</span>
                            : <span className="text-slate-700">—</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg border ${sc.color} ${sc.bg} ${sc.border}`}>
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-amber-400">{timeSince(o.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {!o.shipperId && ["PENDING","CONFIRMED"].includes(o.backendStatus) && (
                              <button
                                type="button"
                                onClick={() => { setAssignModal(o.id); setSelectedShipper(""); setShipperSearch(""); }}
                                className="h-7 px-2.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20 text-[11px] font-semibold hover:bg-amber-500/25 transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Truck size={10} /> Gán
                              </button>
                            )}
                            {nextList.length > 0 && (
                              <button
                                type="button"
                                onClick={() => { setStatusModal({ orderId: o.id, backendStatus: o.backendStatus }); setSelectedStatus(""); }}
                                className="h-7 px-2.5 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/20 text-[11px] font-semibold hover:bg-sky-500/25 transition-all cursor-pointer flex items-center gap-1"
                              >
                                <ArrowRight size={10} /> Cập nhật
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Assign modal */}
      {assignModal && (() => {
        const order = orders.find(o => o.id === assignModal);
        const q = shipperSearch.toLowerCase();
        const filteredShippers = shippers.filter(s =>
          s.fullName.toLowerCase().includes(q) ||
          (s.homeBaseName || "").toLowerCase().includes(q) ||
          (s.phone || "").includes(q)
        );
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setAssignModal(null)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-slideDown"
              style={{ background: "rgba(18,11,2,0.97)", border: "1px solid rgba(251,191,36,0.15)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-[15px] font-bold text-white mb-1">Gán Shipper</h3>
              <p className="text-[12px] text-slate-500 mb-4">
                Đơn: <span className="text-amber-400 font-semibold">{order?.trackingCode}</span>
                {order?.destBranchName && <span className="ml-2 text-slate-600">→ {order.destBranchName}</span>}
              </p>
              <div className="relative mb-3">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={shipperSearch}
                  onChange={e => setShipperSearch(e.target.value)}
                  placeholder="Tìm tên, khu vực, SĐT..."
                  autoFocus
                  className="w-full h-9 rounded-xl pl-9 pr-4 text-[13px] text-slate-200 placeholder-slate-600 outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(251,191,36,0.12)" }}
                />
                {shipperSearch && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600">{filteredShippers.length} kq</span>
                )}
              </div>
              <div className="space-y-1.5 mb-4 max-h-56 overflow-y-auto pr-0.5">
                {filteredShippers.length === 0 && (
                  <p className="text-[13px] text-slate-600 text-center py-6">
                    {shippers.length === 0 ? "Không có shipper khả dụng" : "Không tìm thấy shipper"}
                  </p>
                )}
                {filteredShippers.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedShipper(s.userId)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] transition-all cursor-pointer border flex items-center gap-3 ${
                      selectedShipper === s.userId
                        ? "bg-amber-500/15 border-amber-500/25 text-amber-300"
                        : "bg-white/[0.03] border-white/[0.05] text-slate-400 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="h-7 w-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-[11px] font-bold text-amber-400 flex-shrink-0">
                      {s.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{s.fullName}</p>
                      <p className="text-[10px] text-slate-600 truncate">{[s.homeBaseName, s.phone].filter(Boolean).join(" · ")}</p>
                    </div>
                    {selectedShipper === s.userId && <CheckCircle size={14} className="text-amber-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setAssignModal(null)}
                  className="flex-1 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-slate-400 hover:bg-white/[0.06] transition-all cursor-pointer">
                  Hủy
                </button>
                <button type="button" disabled={!selectedShipper || assigning} onClick={handleAssign}
                  className="flex-1 h-10 rounded-xl text-[13px] font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>
                  {assigning ? <Loader size={14} className="animate-spin" /> : "Xác nhận gán"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Status update modal */}
      {statusModal && (() => {
        const order = orders.find(o => o.id === statusModal.orderId);
        const nextList = NEXT_STATUSES[statusModal.backendStatus] ?? [];
        const currentCfg = BACKEND_STATUS_CFG[statusModal.backendStatus];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setStatusModal(null)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-slideDown"
              style={{ background: "rgba(2,12,22,0.97)", border: "1px solid rgba(56,189,248,0.15)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-[15px] font-bold text-white mb-1">Cập nhật trạng thái</h3>
              <p className="text-[12px] text-slate-500 mb-4">
                <span className="text-sky-400 font-semibold">{order?.trackingCode}</span>
                <span className="mx-2 text-slate-700">·</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${currentCfg?.color} ${currentCfg?.bg} ${currentCfg?.border}`}>
                  {currentCfg?.label}
                </span>
              </p>
              <p className="text-[11px] text-slate-600 mb-2 uppercase tracking-wider font-semibold">Chọn trạng thái tiếp theo</p>
              <div className="space-y-2 mb-4">
                {nextList.map((ns) => {
                  const cfg = BACKEND_STATUS_CFG[ns];
                  return (
                    <button
                      key={ns}
                      type="button"
                      onClick={() => setSelectedStatus(ns)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-[13px] transition-all cursor-pointer border flex items-center gap-3 ${
                        selectedStatus === ns
                          ? "bg-sky-500/15 border-sky-500/25"
                          : "bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${cfg?.color} ${cfg?.bg} ${cfg?.border}`}>
                        {cfg?.label}
                      </span>
                      {selectedStatus === ns && <CheckCircle size={14} className="text-sky-400 ml-auto flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStatusModal(null)}
                  className="flex-1 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-slate-400 hover:bg-white/[0.06] transition-all cursor-pointer">
                  Hủy
                </button>
                <button type="button" disabled={!selectedStatus || updating} onClick={handleStatusUpdate}
                  className="flex-1 h-10 rounded-xl text-[13px] font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #0ea5e9, #38bdf8)" }}>
                  {updating ? <Loader size={14} className="animate-spin" /> : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
