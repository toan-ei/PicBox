"use client";
import { AdminLayout } from "@/components/layout";
import { User, Mail, Phone, MapPin, Camera, Check } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "Admin", email: "admin@picbox.vn",
    phone: "0901234567", address: "TP. Hồ Chí Minh",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Hồ sơ cá nhân</h2>
          <p className="text-slate-500 text-sm mt-1">Quản lý thông tin tài khoản admin</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-400">
                A
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-500 transition-colors">
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-white">{profile.name}</p>
              <p className="text-sm text-slate-500">Super Admin</p>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Họ tên", key: "name", icon: User, type: "text" },
              { label: "Email", key: "email", icon: Mail, type: "email" },
              { label: "Số điện thoại", key: "phone", icon: Phone, type: "tel" },
              { label: "Địa chỉ", key: "address", icon: MapPin, type: "text" },
            ].map(f => {
              const Icon = f.icon;
              return (
                <div key={f.key}>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">{f.label}</label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={f.type}
                      value={profile[f.key as keyof typeof profile]}
                      onChange={e => setProfile({...profile, [f.key]: e.target.value})}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2 border-t border-white/[0.06]">
            <button onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                saved ? "bg-green-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}>
              {saved ? <><Check size={15} /> Đã lưu!</> : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}