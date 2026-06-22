"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Clock, CheckCircle, AlertCircle, Truck, ChevronRight, Search, Home, List, Wallet, User, Loader } from "lucide-react";
import { getMyOrders } from "@picbox/utils";
import type { Order } from "@picbox/types";

function BottomNav({ active }: { active: string }) {
  const NAV = [
    { href: "/", icon: Home, label: "Trang chủ" },
    { href: "/orders", icon: List, label: "Đơn hàng" },
    { href: "/earnings", icon: Wallet, label: "Thu nhập" },
    { href: "/profile", icon: User, label: "Tài khoản" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{ background: "rgba(4,12,28,0.97)", borderTop: "1px solid rgba(56,189,248,0.10)", backdropFilter: "blur(20px)" }}>
      {NAV.map((n) => {
        const Icon = n.icon;
        const isActive = n.href === active;
        return (
          <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${isActive ? "" : "opacity-50"}`}>
            <Icon size={20} className={isActive ? "text-cyan-400" : "text-slate-500"} />
            <span className={`text-[10px] font-semibold ${isActive ? "text-cyan-400" : "text-slate-600"}`}>{n.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

type DisplayStatus = "pending" | "picking" | "delivering" | "delivered" | "failed";

function toDisplayStatus(status: string): DisplayStatus {
  if (["pending", "confirmed"].includes(status)) return "pending";
  if (["picked_up", "in_transit", "at_hub", "sorting"].includes(status)) return "picking";
  if (status === "out_for_delivery") return "delivering";
  if (status === "delivered") return "delivered";
  return "failed";
}

const STATUS_CONFIG: Record<DisplayStatus, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  pending:    { label: "Chờ lấy",    icon: Clock,       color: "text-amber-400",   bg: "bg-amber-500/15",   border: "border-amber-500/20" },
  picking:    { label: "Đang lấy",   icon: Package,     color: "text-cyan-400",    bg: "bg-cyan-500/15",    border: "border-cyan-500/20" },
  delivering: { label: "Đang giao",  icon: Truck,       color: "text-sky-400",     bg: "bg-sky-500/15",     border: "border-sky-500/20" },
  delivered:  { label: "Hoàn thành", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20" },
  failed:     { label: "Thất bại",   icon: AlertCircle, color: "text-rose-400",    bg: "bg-rose-500/15",    border: "border-rose-500/20" },
};

const TABS = [
  { key: "active",  label: "Đang giao" },
  { key: "pending", label: "Chờ lấy" },
  { key: "done",    label: "Hoàn thành" },
];

function fmtTime(iso: string) {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function ShipperOrdersPage() {
  const [tab, setTab] = useState("active");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders(0, 100)
      .then(page => setOrders(page.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const ds = toDisplayStatus(o.status);
    const matchTab =
      tab === "active"  ? ["picking", "delivering"].includes(ds) :
      tab === "pending" ? ds === "pending" :
      ["delivered", "failed"].includes(ds);
    const matchSearch =
      o.trackingCode.toLowerCase().includes(q) ||
      o.receiverName.toLowerCase().includes(q);
    return matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen bg-[#020c18]">
      <div className="relative z-10 max-w-md mx-auto px-4 pt-6 pb-24">
        <div className="mb-5">
          <h1 className="text-[20px] font-bold text-white">Đơn hàng</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Quản lý các đơn được giao cho bạn</p>
        </div>

        <div className="relative mb-4">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm mã đơn, tên khách..."
            className="w-full h-10 rounded-2xl pl-10 pr-4 text-[13px] text-slate-300 placeholder-slate-600 outline-none transition-all"
            style={{ background: "rgba(8,20,40,0.8)", border: "1px solid rgba(56,189,248,0.10)" }}
          />
        </div>

        <div className="flex gap-2 mb-4 p-1 rounded-2xl" style={{ background: "rgba(8,20,40,0.7)", border: "1px solid rgba(56,189,248,0.08)" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                tab === t.key
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={20} className="text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-600">
                <Package size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-[13px]">Không có đơn nào</p>
              </div>
            )}
            {filtered.map((order) => {
              const ds = toDisplayStatus(order.status);
              const sc = STATUS_CONFIG[ds];
              const Icon = sc.icon;
              return (
                <Link key={order.id} href={`/delivery/${order.id}`}>
                  <div
                    className="rounded-2xl p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200 mb-1"
                    style={{ background: "rgba(8,20,40,0.8)", border: "1px solid rgba(56,189,248,0.08)" }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-[13px] font-bold text-white">{order.trackingCode}</p>
                        <p className="text-[11px] text-slate-500">{fmtTime(order.createdAt)}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-xl border ${sc.color} ${sc.bg} ${sc.border}`}>
                        <Icon size={11} /> {sc.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-xl gradient-cyan flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                        {order.receiverName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white">{order.receiverName}</p>
                        <p className="text-[11px] text-slate-500">{order.receiverPhone}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-[12px] text-slate-400">
                        <div className="h-4 w-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[7px] font-bold text-emerald-400">A</span>
                        </div>
                        {order.senderAddress || order.senderName}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-slate-400">
                        <div className="h-4 w-4 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[7px] font-bold text-cyan-400">B</span>
                        </div>
                        {order.receiverAddress}
                      </div>
                    </div>

                    <div className="flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.75rem" }}>
                      <div className="flex items-center gap-3">
                        {order.codAmount > 0 && (
                          <span className="text-[12px] font-semibold text-emerald-400">COD ₫{order.codAmount.toLocaleString()}</span>
                        )}
                        <span className="text-[11px] text-slate-600">Cước ₫{order.shippingFee.toLocaleString()}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-600" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav active="/orders" />
    </div>
  );
}
