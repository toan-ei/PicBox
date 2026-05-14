"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout";
import { Shield, Plus, Edit2, Trash2, Check, X } from "lucide-react";

interface Role {
  id: string;
  name: string;
  label: string;
  description: string;
  userCount: number;
  color: string;
}

interface Permission {
  module: string;
  actions: { key: string; label: string }[];
}

const ROLES: Role[] = [
  { id: "admin",   name: "admin",   label: "Super Admin",  description: "Toàn quyền truy cập hệ thống",                 userCount: 2,   color: "#a78bfa" },
  { id: "ops",     name: "ops",     label: "Ops Manager",  description: "Quản lý vận hành, gán shipper, xử lý đơn",     userCount: 5,   color: "#fbbf24" },
  { id: "shipper", name: "shipper", label: "Shipper",       description: "Nhận đơn, cập nhật trạng thái giao hàng",      userCount: 186, color: "#38bdf8" },
  { id: "driver",  name: "driver",  label: "Driver",        description: "Vận chuyển nội bộ giữa các hub",               userCount: 24,  color: "#34d399" },
  { id: "sender",  name: "sender",  label: "Sender",        description: "Tạo đơn hàng, theo dõi trạng thái",           userCount: 3024,color: "#94a3b8" },
];

const PERMISSIONS: Permission[] = [
  {
    module: "Đơn hàng",
    actions: [
      { key: "order.read",   label: "Xem đơn hàng" },
      { key: "order.create", label: "Tạo đơn hàng" },
      { key: "order.update", label: "Cập nhật trạng thái" },
      { key: "order.cancel", label: "Huỷ đơn hàng" },
      { key: "order.assign", label: "Gán shipper" },
    ],
  },
  {
    module: "Người dùng",
    actions: [
      { key: "user.read",    label: "Xem danh sách" },
      { key: "user.create",  label: "Tạo tài khoản" },
      { key: "user.update",  label: "Cập nhật thông tin" },
      { key: "user.suspend", label: "Khoá tài khoản" },
    ],
  },
  {
    module: "Tài chính",
    actions: [
      { key: "finance.read",    label: "Xem báo cáo tài chính" },
      { key: "finance.cod",     label: "Xử lý thu hộ COD" },
      { key: "finance.refund",  label: "Hoàn tiền" },
    ],
  },
  {
    module: "Hệ thống",
    actions: [
      { key: "system.config",  label: "Cấu hình hệ thống" },
      { key: "system.notify",  label: "Gửi thông báo" },
      { key: "system.report",  label: "Xuất báo cáo" },
    ],
  },
];

// Default permission matrix
const DEFAULT_PERMS: Record<string, string[]> = {
  admin:   ["order.read","order.create","order.update","order.cancel","order.assign","user.read","user.create","user.update","user.suspend","finance.read","finance.cod","finance.refund","system.config","system.notify","system.report"],
  ops:     ["order.read","order.update","order.assign","user.read","finance.read","finance.cod","system.notify","system.report"],
  shipper: ["order.read","order.update","finance.cod"],
  driver:  ["order.read","order.update"],
  sender:  ["order.read","order.create","order.cancel"],
};

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [perms, setPerms] = useState(DEFAULT_PERMS);

  const currentPerms = perms[selectedRole] ?? [];

  function togglePerm(key: string) {
    setPerms((prev) => ({
      ...prev,
      [selectedRole]: currentPerms.includes(key)
        ? currentPerms.filter((k) => k !== key)
        : [...currentPerms, key],
    }));
  }

  const role = ROLES.find((r) => r.id === selectedRole)!;

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Phân quyền (RBAC)</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Quản lý vai trò và quyền truy cập theo từng nhóm người dùng</p>
          </div>
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer">
            <Plus size={14} /> Thêm vai trò
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Role list */}
          <div className="space-y-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`w-full text-left rounded-2xl p-4 transition-all duration-200 border cursor-pointer ${
                  selectedRole === r.id
                    ? "border-indigo-500/30 bg-indigo-500/[0.06]"
                    : "glass hover:border-white/[0.10]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${r.color}20` }}
                  >
                    <Shield size={14} style={{ color: r.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate">{r.label}</p>
                    <p className="text-[10px] text-slate-600">{r.userCount} người dùng</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{r.description}</p>
              </button>
            ))}
          </div>

          {/* Permission matrix */}
          <div className="lg:col-span-3 glass rounded-2xl p-5">
            {/* Role header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${role.color}20` }}
                >
                  <Shield size={16} style={{ color: role.color }} />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">{role.label}</h3>
                  <p className="text-[12px] text-slate-500">{currentPerms.length} quyền được cấp / {PERMISSIONS.flatMap(p => p.actions).length} tổng</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[12px] text-slate-400 hover:bg-white/[0.06] transition-all cursor-pointer">
                  <Edit2 size={12} /> Đặt lại
                </button>
                <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl gradient-brand text-white text-[12px] font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer">
                  <Check size={12} /> Lưu thay đổi
                </button>
              </div>
            </div>

            {/* Permission modules */}
            <div className="space-y-5">
              {PERMISSIONS.map((module) => (
                <div key={module.module}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600 mb-2.5">{module.module}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {module.actions.map((action) => {
                      const granted = currentPerms.includes(action.key);
                      const isAdmin = selectedRole === "admin";
                      return (
                        <button
                          key={action.key}
                          onClick={() => !isAdmin && togglePerm(action.key)}
                          disabled={isAdmin}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150 text-left ${
                            isAdmin
                              ? "bg-emerald-500/[0.08] border-emerald-500/15 cursor-default"
                              : granted
                              ? "bg-indigo-500/[0.10] border-indigo-500/20 cursor-pointer hover:bg-indigo-500/15"
                              : "bg-white/[0.02] border-white/[0.05] cursor-pointer hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className={`h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0 border transition-all ${
                            isAdmin || granted
                              ? isAdmin
                                ? "bg-emerald-500/20 border-emerald-500/30"
                                : "bg-indigo-500/20 border-indigo-500/30"
                              : "bg-white/[0.03] border-white/[0.10]"
                          }`}>
                            {(isAdmin || granted) && (
                              <Check size={10} className={isAdmin ? "text-emerald-400" : "text-indigo-400"} />
                            )}
                          </div>
                          <span className={`text-[12px] font-medium ${granted || isAdmin ? "text-white" : "text-slate-500"}`}>
                            {action.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="h-3 w-3 rounded-sm bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Check size={7} className="text-emerald-400" />
                </span>
                Super Admin (không thể thay đổi)
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="h-3 w-3 rounded-sm bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Check size={7} className="text-indigo-400" />
                </span>
                Đã cấp quyền
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="h-3 w-3 rounded-sm bg-white/[0.03] border border-white/[0.10]" />
                Chưa cấp quyền
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
