"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout";
import { MapPin, Package, Users, Plus, Activity, Loader, Phone } from "lucide-react";
import { getAllHubsAndBranches } from "@picbox/utils";
import type { AdminHub } from "@picbox/utils";

const STATUS_CONFIG = {
  active:   { label: "Hoạt động", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
  inactive: { label: "Tạm dừng",  color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/15" },
};

export default function HubsPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [hubs, setHubs]             = useState<AdminHub[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getAllHubsAndBranches()
      .then(setHubs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = typeFilter === "all" ? hubs : hubs.filter((h) => h.type === typeFilter);
  const totalHubs     = hubs.filter((h) => h.type === "hub").length;
  const totalBranches = hubs.filter((h) => h.type === "branch").length;
  const activeCount   = hubs.filter((h) => h.active).length;
  const totalCapacity = hubs.reduce((s, h) => s + (h.maxCapacity ?? 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Hub & Chi nhánh</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Quản lý mạng lưới kho vận và điểm giao dịch</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 h-9 px-4 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer">
            <Plus size={15} /> Thêm Hub
          </button>
        </div>

        {/* System summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 stagger">
          {[
            { label: "Hub trung tâm",  value: String(totalHubs),     unit: "hub",      icon: Activity, color: "text-indigo-400", bg: "bg-indigo-500/[0.08]" },
            { label: "Chi nhánh",      value: String(totalBranches),  unit: "chi nhánh",icon: MapPin,   color: "text-purple-400", bg: "bg-purple-500/[0.08]" },
            { label: "Đang hoạt động", value: String(activeCount),    unit: "điểm",     icon: Users,    color: "text-sky-400",    bg: "bg-sky-500/[0.08]" },
            { label: "Sức chứa tổng",  value: String(totalCapacity || "—"), unit: "kiện", icon: Package, color: "text-emerald-400", bg: "bg-emerald-500/[0.08]" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass rounded-2xl p-4 animate-fadeIn">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon size={16} className={s.color} />
                  </div>
                  <span className="text-[11px] text-slate-500">{s.label}</span>
                </div>
                {loading ? (
                  <div className="h-7 w-10 bg-white/[0.06] rounded animate-pulse" />
                ) : (
                  <p className="text-[24px] font-bold text-white">{s.value}</p>
                )}
                <p className="text-[11px] text-slate-600">{s.unit}</p>
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
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
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                typeFilter === f.key
                  ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                  : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Hub grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={20} className="text-indigo-400 animate-spin" />
            <span className="ml-2 text-[13px] text-slate-500">Đang tải dữ liệu hub...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl py-16 text-center">
            <p className="text-[13px] text-slate-600">Chưa có hub hoặc chi nhánh nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((hub) => {
              const sc = hub.active ? STATUS_CONFIG.active : STATUS_CONFIG.inactive;
              const isHub = hub.type === "hub";

              return (
                <div key={hub.id} className="glass rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isHub ? "bg-indigo-500/[0.12]" : "bg-purple-500/[0.12]"}`}>
                        <MapPin size={16} className={isHub ? "text-indigo-400" : "text-purple-400"} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white leading-tight">{hub.name}</p>
                        <p className="text-[10px] text-slate-600">{hub.id}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-lg border ${sc.color} ${sc.bg} ${sc.border}`}>
                      {sc.label}
                    </span>
                  </div>

                  {/* Address */}
                  <p className="text-[12px] text-slate-500 mb-3">
                    {[hub.address, hub.province].filter(Boolean).join(", ") || "—"}
                  </p>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center rounded-xl bg-white/[0.03] border border-white/[0.04] py-2">
                      <p className="text-[12px] font-bold text-white">{isHub ? "Hub" : "Branch"}</p>
                      <p className="text-[9px] text-slate-600 uppercase tracking-wide mt-0.5">Loại</p>
                    </div>
                    <div className="text-center rounded-xl bg-white/[0.03] border border-white/[0.04] py-2">
                      <p className="text-[12px] font-bold text-white">{hub.maxCapacity ?? "—"}</p>
                      <p className="text-[9px] text-slate-600 uppercase tracking-wide mt-0.5">Sức chứa</p>
                    </div>
                    <div className="text-center rounded-xl bg-white/[0.03] border border-white/[0.04] py-2 flex flex-col items-center justify-center gap-0.5">
                      <Phone size={10} className="text-slate-500" />
                      <p className="text-[9px] text-slate-600 truncate w-full text-center px-1">{hub.contactPhone || "—"}</p>
                    </div>
                  </div>

                  {/* Hub parent info for branches */}
                  {hub.hubName && (
                    <p className="text-[11px] text-slate-600 mt-3">
                      Thuộc hub: <span className="text-slate-400">{hub.hubName}</span>
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
