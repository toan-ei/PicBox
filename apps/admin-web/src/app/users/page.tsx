"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout";
import { Badge } from "@/components/ui";
import { Plus, Search, Trash2, X, Loader } from "lucide-react";
import { getAllUsers, deleteUser, apiRegister } from "@picbox/utils";
import type { AdminUser } from "@picbox/utils";

const ROLE_CONFIG: Record<string, { label: string; variant: "danger" | "warning" | "info" | "default" }> = {
  admin:   { label: "Admin",       variant: "danger" },
  ops:     { label: "Ops Manager", variant: "warning" },
  shipper: { label: "Shipper",     variant: "info" },
  driver:  { label: "Driver",      variant: "info" },
  sender:  { label: "Sender",      variant: "default" },
};

const ROLE_TABS = [
  { key: "all",     label: "Tất cả" },
  { key: "admin",   label: "Admin" },
  { key: "ops",     label: "Ops" },
  { key: "shipper", label: "Shipper" },
  { key: "driver",  label: "Driver" },
  { key: "sender",  label: "Sender" },
];

export default function UsersPage() {
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [loading, setLoading]     = useState(true);
  const [creating, setCreating]   = useState(false);
  const [form, setForm]           = useState({ fullName: "", username: "", phone: "", password: "PicBox@2026", role: "sender" });
  const [formError, setFormError] = useState("");

  const loadUsers = () => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.fullName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa người dùng này?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.fullName) {
      setFormError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setCreating(true);
    setFormError("");
    try {
      await apiRegister({
        username: form.username,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone,
      });
      setModalOpen(false);
      setForm({ fullName: "", username: "", phone: "", password: "PicBox@2026", role: "sender" });
      loadUsers();
    } catch (e: unknown) {
      setFormError((e as Error).message);
    } finally {
      setCreating(false);
    }
  };

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
            type="button"
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
              placeholder="Tìm theo tên, username..."
              className="w-full h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] pl-9 pr-4 text-[13px] text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {ROLE_TABS.map((r) => (
              <button
                key={r.key}
                type="button"
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
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader size={20} className="text-indigo-400 animate-spin" />
              <span className="ml-2 text-[13px] text-slate-500">Đang tải người dùng...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Người dùng", "Điện thoại", "Vai trò", ""].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-[13px] text-slate-600">
                        Không có người dùng nào
                      </td>
                    </tr>
                  ) : filtered.map((user) => {
                    const rc = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.sender;
                    return (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center text-[12px] font-bold text-white shadow-md shadow-indigo-500/15">
                              {(user.fullName || user.username).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-white">{user.fullName || user.username}</p>
                              <p className="text-[11px] text-slate-500">{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-slate-400">{user.phone || "—"}</td>
                        <td className="px-5 py-3.5">
                          <Badge variant={rc.variant}>{rc.label}</Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              title="Xóa người dùng"
                              onClick={() => handleDelete(user.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.06] transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
            <p className="text-[12px] text-slate-600">
              Hiển thị {filtered.length} / {users.length} người dùng
            </p>
          </div>
        </div>

        {/* Add User Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0c1225]/95 backdrop-blur-xl p-6 shadow-2xl animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-semibold text-white">Thêm người dùng</h2>
                <button type="button" title="Đóng" onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <form className="space-y-3.5" onSubmit={handleCreate}>
                {[
                  { key: "fullName",  label: "Họ và tên",      placeholder: "Nguyễn Văn A",    type: "text" },
                  { key: "username",  label: "Username / Email", placeholder: "user@picbox.vn", type: "text" },
                  { key: "phone",     label: "Số điện thoại",  placeholder: "0901234567",       type: "tel" },
                  { key: "password",  label: "Mật khẩu",       placeholder: "••••••••",         type: "password" },
                ].map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-400">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 text-[13px] text-white placeholder-slate-600 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>
                ))}
                {formError && (
                  <p className="text-[12px] text-rose-400">{formError}</p>
                )}
                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-slate-400 hover:bg-white/[0.06] transition-all cursor-pointer">
                    Hủy
                  </button>
                  <button type="submit" disabled={creating} className="flex-1 h-10 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer disabled:opacity-60">
                    {creating ? "Đang tạo..." : "Tạo người dùng"}
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
