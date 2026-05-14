"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout";
import { Badge } from "@/components/ui";
import { Plus, Search, Edit2, Trash2, X, Filter } from "lucide-react";

type UserRole = "admin" | "ops" | "shipper" | "driver" | "sender";
type UserStatus = "active" | "inactive" | "suspended" | "pending";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  created: string;
}

const users: UserData[] = [
  { id: "1", name: "Nguyễn Admin", email: "admin@picbox.vn", phone: "0901234567", role: "admin", status: "active", created: "15/01/2026" },
  { id: "2", name: "Trần Ops Manager", email: "ops01@picbox.vn", phone: "0912345678", role: "ops", status: "active", created: "01/02/2026" },
  { id: "3", name: "Lê Shipper Một", email: "shipper01@picbox.vn", phone: "0923456789", role: "shipper", status: "active", created: "10/02/2026" },
  { id: "4", name: "Phạm Driver", email: "driver01@picbox.vn", phone: "0934567890", role: "driver", status: "inactive", created: "01/03/2026" },
  { id: "5", name: "Hoàng Sender", email: "sender01@picbox.vn", phone: "0945678901", role: "sender", status: "active", created: "15/03/2026" },
  { id: "6", name: "Võ Shipper Hai", email: "shipper02@picbox.vn", phone: "0956789012", role: "shipper", status: "suspended", created: "20/03/2026" },
  { id: "7", name: "Đặng Driver Hai", email: "driver02@picbox.vn", phone: "0967890123", role: "driver", status: "active", created: "01/04/2026" },
  { id: "8", name: "Bùi Sender Hai", email: "sender02@picbox.vn", phone: "0978901234", role: "sender", status: "pending", created: "10/04/2026" },
];

const roleConfig: Record<UserRole, { label: string; variant: "danger" | "warning" | "info" | "default" }> = {
  admin: { label: "Admin", variant: "danger" },
  ops: { label: "Ops Manager", variant: "warning" },
  shipper: { label: "Shipper", variant: "info" },
  driver: { label: "Driver", variant: "info" },
  sender: { label: "Sender", variant: "default" },
};

const statusConfig: Record<UserStatus, { label: string; variant: "success" | "default" | "danger" | "warning" }> = {
  active: { label: "Hoạt động", variant: "success" },
  inactive: { label: "Ngưng", variant: "default" },
  suspended: { label: "Bị khóa", variant: "danger" },
  pending: { label: "Chờ duyệt", variant: "warning" },
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Quản lý người dùng</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Quản lý tài khoản và phân quyền</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer"
          >
            <Plus size={15} /> Thêm người dùng
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, email..."
              className="w-full h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] pl-9 pr-4 text-[13px] text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {[
              { key: "all", label: "Tất cả" },
              { key: "admin", label: "Admin" },
              { key: "ops", label: "Ops" },
              { key: "shipper", label: "Shipper" },
              { key: "driver", label: "Driver" },
              { key: "sender", label: "Sender" },
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setRoleFilter(r.key)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                  roleFilter === r.key
                    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                    : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04] hover:text-slate-400"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Người dùng", "Điện thoại", "Vai trò", "Trạng thái", "Ngày tạo", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center text-[12px] font-bold text-white shadow-md shadow-indigo-500/15">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-white">{user.name}</p>
                          <p className="text-[11px] text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-400">{user.phone}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={roleConfig[user.role].variant}>{roleConfig[user.role].label}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusConfig[user.status].variant}>{statusConfig[user.status].label}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-500">{user.created}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer">
                          <Edit2 size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.06] transition-all cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
            <p className="text-[12px] text-slate-600">
              Hiển thị {filtered.length} / {users.length} người dùng
            </p>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`h-7 w-7 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
                    p === 1 ? "bg-indigo-500/15 text-indigo-400" : "text-slate-500 hover:bg-white/[0.04]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0c1225]/95 backdrop-blur-xl p-6 shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-semibold text-white">Thêm người dùng</h2>
                <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <form className="space-y-3.5">
                {[
                  { label: "Họ và tên", placeholder: "Nguyễn Văn A", type: "text" },
                  { label: "Email", placeholder: "user@picbox.vn", type: "email" },
                  { label: "Số điện thoại", placeholder: "0901234567", type: "tel" },
                ].map((f) => (
                  <div key={f.label} className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-400">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 text-[13px] text-white placeholder-slate-600 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-400">Vai trò</label>
                  <select className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 text-[13px] text-white outline-none focus:border-indigo-500/40 cursor-pointer">
                    <option value="sender">Sender</option>
                    <option value="shipper">Shipper</option>
                    <option value="driver">Driver</option>
                    <option value="ops">Ops Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-slate-400 hover:bg-white/[0.06] transition-all cursor-pointer">
                    Hủy
                  </button>
                  <button type="submit" className="flex-1 h-10 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer">
                    Tạo người dùng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
