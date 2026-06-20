"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout";
import { Badge } from "@/components/ui";
import { Save, RotateCcw } from "lucide-react";

type ConfigCategory = "general" | "shipping" | "payment" | "notification" | "security";

interface Config {
  key: string;
  value: string;
  desc: string;
  category: ConfigCategory;
}

const configs: Config[] = [
  { key: "app_name", value: "PicBox", desc: "Tên ứng dụng hiển thị", category: "general" },
  { key: "maintenance_mode", value: "false", desc: "Chế độ bảo trì hệ thống", category: "general" },
  { key: "max_order_weight", value: "50", desc: "Trọng lượng tối đa đơn hàng (kg)", category: "shipping" },
  { key: "shipper_radius_km", value: "15", desc: "Bán kính tìm shipper (km)", category: "shipping" },
  { key: "cod_limit", value: "10000000", desc: "Giới hạn COD tối đa (VND)", category: "payment" },
  { key: "sms_enabled", value: "true", desc: "Bật/tắt gửi SMS thông báo", category: "notification" },
  { key: "email_enabled", value: "true", desc: "Bật/tắt gửi email thông báo", category: "notification" },
  { key: "jwt_expiry_minutes", value: "60", desc: "Thời gian hết hạn JWT (phút)", category: "security" },
  { key: "refresh_token_days", value: "30", desc: "Thời gian hết hạn refresh token (ngày)", category: "security" },
];

const catConfig: Record<ConfigCategory, { label: string; variant: "default" | "info" | "success" | "warning" | "danger" }> = {
  general: { label: "Chung", variant: "default" },
  shipping: { label: "Vận chuyển", variant: "info" },
  payment: { label: "Thanh toán", variant: "success" },
  notification: { label: "Thông báo", variant: "warning" },
  security: { label: "Bảo mật", variant: "danger" },
};

export default function SystemPage() {
  const [activeCat, setActiveCat] = useState<string>("all");
  const [data, setData] = useState(configs);

  const filtered = activeCat === "all" ? data : data.filter((c) => c.category === activeCat);

  const handleUpdate = (key: string, val: string) => {
    setData((prev) => prev.map((c) => (c.key === key ? { ...c, value: val } : c)));
  };

  const cats = [
    { key: "all", label: "Tất cả" },
    { key: "general", label: "Chung" },
    { key: "shipping", label: "Vận chuyển" },
    { key: "payment", label: "Thanh toán" },
    { key: "notification", label: "Thông báo" },
    { key: "security", label: "Bảo mật" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-5 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Cấu hình hệ thống</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">Quản lý thông số hệ thống</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-slate-400 hover:bg-white/[0.06] transition-all cursor-pointer">
              <RotateCcw size={14} /> Reset
            </button>
            <button className="inline-flex items-center gap-2 h-9 px-4 rounded-xl gradient-brand text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all cursor-pointer">
              <Save size={14} /> Lưu thay đổi
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {cats.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                activeCat === c.key
                  ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                  : "bg-white/[0.02] text-slate-500 border-white/[0.06] hover:bg-white/[0.04]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Config list */}
        <div className="space-y-3 stagger">
          {filtered.map((config) => (
            <div key={config.key} className="rounded-2xl glass p-5 transition-all duration-200 hover:border-white/[0.1] animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <code className="text-[13px] font-mono text-indigo-400 bg-indigo-500/[0.08] px-2 py-0.5 rounded-md">
                      {config.key}
                    </code>
                    <Badge variant={catConfig[config.category].variant}>
                      {catConfig[config.category].label}
                    </Badge>
                  </div>
                  <p className="text-[13px] text-slate-400">{config.desc}</p>
                </div>
                <div className="w-full sm:w-44">
                  {config.value === "true" || config.value === "false" ? (
                    <button
                      onClick={() => handleUpdate(config.key, config.value === "true" ? "false" : "true")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 cursor-pointer ${
                        config.value === "true" ? "bg-indigo-600" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                          config.value === "true" ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  ) : (
                    <input
                      value={config.value}
                      onChange={(e) => handleUpdate(config.key, e.target.value)}
                      className="w-full h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 text-[13px] text-white outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
