"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout";
import { Badge } from "@/components/ui";
import { Plus, Search, Trash2, X, Loader, UserCircle, RefreshCw } from "lucide-react";
import { getAllUsers, adminCreateUser, deleteUser, countUsersByRole } from "@picbox/utils";
import type { AdminUser } from "@picbox/utils";

const ROLE_CFG: Record<string, { label: string; variant: "danger" | "warning" | "info" | "default" }> = {
  admin:   { label: "Admin",   variant: "danger"  },
  ops:     { label: "Ops",     variant: "warning" },
  shipper: { label: "Shipper", variant: "info"    },
  driver:  { label: "Driver",  variant: "info"    },
  sender:  { label: "Sender",  variant: "default" },
};

const ROLE_KEYS = ["admin", "ops", "shipper", "sender"] as const;

const ROLE_TABS = [
  { key: "all",     label: "Tất cả",  countKey: ""        },
  { key: "admin",   label: "Admin",   countKey: "ADMIN"   },
  { key: "ops",     label: "Ops",     countKey: "OPS"     },
  { key: "shipper", label: "Shipper", countKey: "SHIPPER" },
  { key: "sender",  label: "Sender",  countKey: "SENDER"  },
];

const AVATAR_COLORS = [
  "from-indigo-500 to-violet-500",
  "from-sky-500   to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500  to-pink-500",
];

function avatarColor(str: string) {
  let n = 0;
  for (const c of str) n += c.charCodeAt(0);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

function normalizeRole(raw: string): string {
  return (raw || "sender").toLowerCase().replace(/^role_/, "");
}

export default function UsersPage() {
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [modalOpen, setModalOpen]   = useState(false);
  const [users, setUsers]           = useState<AdminUser[]>([]);
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({});
  const [loading, setLoading]       = useState(true);
  const [creating, setCreating]     = useState(false);
  const [form, setForm]             = useState({ fullName: "", username: "", phone: "", password: "PicBox@2026" });
  const [formError, setFormError]   = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([
      getAllUsers(),
      ...ROLE_KEYS.map(r => countUsersByRole(r.toUpperCase()).catch(() => 0)),
    ])
      .then(([data, adminC, opsC, shipperC, senderC]) => {
        setUsers(data as AdminUser[]);
        setRoleCounts({
          admin: adminC as number,
          ops:   opsC   as number,
          shipper: shipperC as number,
          sender:  senderC  as number,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const role = normalizeRole(u.role);
    return (
      (roleFilter === "all" || role === roleFilter) &&
      (u.fullName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || (u.phone || "").includes(q))
    );
  });

  async function handleDelete(id: string) {
    if (!confirm("Xác nhận xóa người dùng này?")) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username || !form.fullName) { setFormError("Vui lòng điền đầy đủ thông tin"); return; }
    setCreating(true);
    setFormError("");
    try {
      await adminCreateUser({
        username: form.username,
        password: form.password,
        fullName: form.fullName,
        phone:    form.phone,
      });
      setModalOpen(false);
      setForm({ fullName: "", username: "", phone: "", password: "PicBox@2026" });
      load();
    } catch (e: unknown) {
      setFormError((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  const totalShown = filtered.length;
  const totalAll   = users.length;

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[18px] font-bold text-white">Quản lý người dùng</h1>
            <p className="text-[12px] text-slate-500 mt-0.5">Quản lý tài khoản và phân quyền người dùng</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Tải lại"
              onClick={load}
              className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer"
            >
              <Plus size={14} /> Thêm người dùng
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, username, SĐT..."
              className="w-full h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] pl-9 pr-4 text-[13px] text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500/40 font-sans"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {ROLE_TABS.map((r) => {
              const count = r.countKey ? (roleCounts[r.key] ?? 0) : totalAll;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRoleFilter(r.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                    roleFilter === r.key
                      ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                      : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04] hover:text-slate-400"
                  }`}
                >
                  {r.label}
                  {!loading && count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      roleFilter === r.key ? "bg-indigo-500/20 text-indigo-300" : "bg-white/[0.05] text-slate-500"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl glass overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader size={16} className="text-indigo-400 animate-spin" />
              <span className="ml-2 text-[13px] text-slate-500">Đang tải danh sách người dùng...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Người dùng", "Email / Username", "Điện thoại", "Vai trò", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-14 text-center">
                        <UserCircle size={32} className="text-slate-700 mx-auto mb-2" />
                        <p className="text-[13px] text-slate-600">
                          {search || roleFilter !== "all"
                            ? "Không tìm thấy người dùng nào"
                            : "Chưa có người dùng nào trong hệ thống"}
                        </p>
                      </td>
                    </tr>
                  ) : filtered.map((user) => {
                    const role = normalizeRole(user.role);
                    const rc   = ROLE_CFG[role] ?? ROLE_CFG.sender;
                    const name = user.fullName || user.username;
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.03] last:border-0"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${avatarColor(name)} flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0`}>
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-[13px] font-medium text-white leading-snug">{name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-slate-400 font-mono">{user.username}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-[12px] text-slate-400">{user.phone || <span className="text-slate-700">—</span>}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={rc.variant}>{rc.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            title="Xóa người dùng"
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/[0.06] transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center justify-between">
            <p className="text-[11px] text-slate-600">
              Hiển thị <span className="text-slate-400 font-medium">{totalShown}</span>
              {" "}/ <span className="text-slate-400 font-medium">{totalAll}</span> người dùng
            </p>
            {roleFilter !== "all" && roleCounts[roleFilter] !== undefined && (
              <p className="text-[11px] text-slate-600">
                Tổng vai trò này: <span className="text-indigo-400 font-semibold">{roleCounts[roleFilter]}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal tạo người dùng */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0c1225] p-6 shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[15px] font-semibold text-white">Thêm người dùng</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Tài khoản mới sẽ có vai trò Sender mặc định</p>
              </div>
              <button
                type="button"
                title="Đóng"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form className="space-y-3" onSubmit={handleCreate}>
              {[
                { key: "fullName", label: "Họ và tên",       placeholder: "Nguyễn Văn A",   type: "text" },
                { key: "username", label: "Email / Username", placeholder: "user@picbox.vn", type: "text" },
                { key: "phone",    label: "Số điện thoại",   placeholder: "0901234567",      type: "tel"  },
                { key: "password", label: "Mật khẩu",        placeholder: "••••••••",        type: "password" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3.5 text-[13px] text-white placeholder-slate-600 outline-none focus:border-indigo-500/40 font-sans"
                  />
                </div>
              ))}

              {formError && (
                <div className="rounded-lg bg-rose-500/[0.08] border border-rose-500/20 px-3 py-2.5">
                  <p className="text-[12px] text-rose-400">{formError}</p>
                </div>
              )}

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-slate-400 hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 h-9 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer disabled:opacity-60"
                >
                  {creating ? "Đang tạo..." : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
