"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout";
import { MapPin, Package, Building2, Activity, Loader, Phone } from "lucide-react";
import { getAllHubsAndBranches } from "@picbox/utils";
import type { AdminHub } from "@picbox/utils";

export default function HubsPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [hubs, setHubs]             = useState<AdminHub[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getAllHubsAndBranches().then(setHubs).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered    = typeFilter === "all" ? hubs : hubs.filter((h) => h.type === typeFilter);
  const totalHubs   = hubs.filter((h) => h.type === "hub").length;
  const totalBranch = hubs.filter((h) => h.type === "branch").length;
  const active      = hubs.filter((h) => h.active).length;
  const capacity    = hubs.reduce((s, h) => s + (h.maxCapacity ?? 0), 0);

  const SUMMARY = [
    { label: "Hub trung tâm",  value: totalHubs,               icon: Activity,   cls: "text-indigo-400 bg-indigo-500/[0.08]" },
    { label: "Chi nhánh",      value: totalBranch,             icon: MapPin,     cls: "text-purple-400 bg-purple-500/[0.08]" },
    { label: "Đang hoạt động", value: active,                  icon: Building2,  cls: "text-sky-400    bg-sky-500/[0.08]" },
    { label: "Sức chứa tổng",  value: capacity || "—",         icon: Package,    cls: "text-emerald-400 bg-emerald-500/[0.08]" },
  ] as const;

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-[18px] font-bold text-white">Hub & Chi nhánh</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">Quản lý mạng lưới kho vận và điểm giao dịch</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {SUMMARY.map(({ label, value, icon: Icon, cls }) => {
            const [textCls, bgCls] = cls.split(" ");
            return (
              <div key={label} className="glass rounded-xl p-3.5 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${bgCls}`}>
                  <Icon size={16} className={textCls} />
                </div>
                <div>
                  {loading
                    ? <div className="h-5 w-8 bg-white/[0.06] rounded animate-pulse mb-1" />
                    : <p className="text-[20px] font-bold text-white leading-none">{value}</p>}
                  <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter */}
        <div className="flex gap-1.5">
          {[
            { key: "all",    label: "Tất cả" },
            { key: "hub",    label: "Hub chính" },
            { key: "branch", label: "Chi nhánh" },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setTypeFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                typeFilter === f.key
                  ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                  : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size={18} className="text-indigo-400 animate-spin" />
            <span className="ml-2 text-[13px] text-slate-500">Đang tải dữ liệu...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl py-14 text-center">
            <MapPin size={32} className="text-slate-700 mx-auto mb-2" />
            <p className="text-[13px] text-slate-600">Chưa có hub hoặc chi nhánh nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filtered.map((hub) => {
              const isHub = hub.type === "hub";
              const isActive = hub.active;
              return (
                <div key={hub.id} className="glass rounded-xl p-4 hover:border-indigo-500/20 transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isHub ? "bg-indigo-500/[0.10]" : "bg-purple-500/[0.10]"}`}>
                        <MapPin size={15} className={isHub ? "text-indigo-400" : "text-purple-400"} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-white leading-tight truncate">{hub.name}</p>
                        <p className="text-[10px] text-slate-600 font-mono mt-0.5">{hub.id}</p>
                      </div>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-lg border ${
                      isActive
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/15"
                        : "text-slate-400 bg-slate-500/10 border-slate-500/15"
                    }`}>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Address */}
                  {(hub.address || hub.province) && (
                    <p className="text-[12px] text-slate-500 mb-3 flex items-start gap-1.5">
                      <MapPin size={11} className="flex-shrink-0 mt-0.5 text-slate-600" />
                      {[hub.address, hub.province].filter(Boolean).join(", ")}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] py-2 text-center">
                      <p className="text-[12px] font-semibold text-white">{isHub ? "Hub" : "Branch"}</p>
                      <p className="text-[9px] text-slate-600 uppercase tracking-wide mt-0.5">Loại</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] py-2 text-center">
                      <p className="text-[12px] font-semibold text-white">{hub.maxCapacity ?? "—"}</p>
                      <p className="text-[9px] text-slate-600 uppercase tracking-wide mt-0.5">Sức chứa</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] py-2 px-1 text-center flex flex-col items-center justify-center gap-0.5">
                      <Phone size={10} className="text-slate-500" />
                      <p className="text-[10px] text-slate-500 truncate w-full text-center">{hub.contactPhone || "—"}</p>
                    </div>
                  </div>

                  {hub.hubName && (
                    <p className="text-[11px] text-slate-600 mt-2.5">
                      Thuộc: <span className="text-slate-400">{hub.hubName}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
