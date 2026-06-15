"use client";
import { AdminLayout } from "@/components/layout";
import { Bell, Shield, Moon, Check } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    emailNotif: true, smsNotif: false, pushNotif: true,
    twoFactor: false, darkMode: true, autoLogout: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings(s => ({...s, [key]: !s[key]}));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button onClick={onToggle}
      className="relative flex-shrink-0 rounded-full transition-colors"
      style={{ height: "22px", width: "40px", background: value ? "#6366f1" : "#334155" }}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Cài đặt hệ thống</h2>
          <p className="text-slate-500 text-sm mt-1">Tuỳ chọn thông báo và bảo mật</p>
        </div>

        {[
          {
            title: "Thông báo", icon: Bell,
            items: [
              { key: "emailNotif", label: "Thông báo qua Email" },
              { key: "smsNotif",   label: "Thông báo qua SMS" },
              { key: "pushNotif",  label: "Thông báo đẩy (trình duyệt)" },
            ]
          },
          {
            title: "Bảo mật", icon: Shield,
            items: [
              { key: "twoFactor",  label: "Xác thực 2 bước (2FA)" },
              { key: "autoLogout", label: "Tự động đăng xuất sau 30 phút" },
            ]
          },
          {
            title: "Giao diện", icon: Moon,
            items: [
              { key: "darkMode", label: "Chế độ tối (Dark mode)" },
            ]
          },
        ].map(section => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon size={16} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
              </div>
              <div className="flex flex-col divide-y divide-white/[0.06]">
                {section.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-400">{item.label}</span>
                    <Toggle
                      value={settings[item.key as keyof typeof settings]}
                      onToggle={() => toggle(item.key as keyof typeof settings)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex justify-end">
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              saved ? "bg-green-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}>
            {saved ? <><Check size={15} /> Đã lưu!</> : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}