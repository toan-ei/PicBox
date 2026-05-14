"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 1200));

    if (email === "admin" && password === "123456") {
      localStorage.setItem("accessToken", "demo-token");
      localStorage.setItem("user", JSON.stringify({ name: "Admin", role: "admin" }));
      router.push("/");
    } else {
      setError("Tài khoản hoặc mật khẩu không đúng. Thử: admin / 123456");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030712]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.07] blur-[100px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-600/[0.07] blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-500/[0.03] blur-[120px]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-[420px] mx-4 animate-fadeIn">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0a0f1e]/80 backdrop-blur-2xl p-8 shadow-2xl shadow-black/40">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex h-[60px] w-[60px] items-center justify-center rounded-2xl gradient-brand shadow-xl shadow-indigo-500/25 mb-5">
              <Package size={26} className="text-white" />
            </div>
            <h1 className="text-[22px] font-bold text-white">Chào mừng trở lại</h1>
            <p className="text-[13px] text-slate-500 mt-1.5">Đăng nhập vào PicBox Admin Panel</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl bg-rose-500/[0.08] border border-rose-500/15 px-4 py-3 text-[13px] text-rose-400 animate-fadeIn">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-400">Tài khoản</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] pl-10 pr-4 text-[14px] text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/15"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-400">Mật khẩu</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] pl-10 pr-11 text-[14px] text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Options row */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-transparent text-indigo-500 focus:ring-indigo-500/30 cursor-pointer"
                />
                <span className="text-[12px] text-slate-500 group-hover:text-slate-400 transition-colors">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <a href="#" className="text-[12px] text-indigo-400 hover:text-indigo-300 transition-colors">
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl gradient-brand text-white text-[14px] font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0f1e] px-3 text-[11px] text-slate-600">DEMO ACCOUNT</span>
            </div>
          </div>

          {/* Demo hint */}
          <div className="rounded-xl bg-indigo-500/[0.06] border border-indigo-500/10 p-3.5">
            <p className="text-[12px] text-slate-400 text-center">
              Tài khoản: <code className="text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded">admin</code>
              {" "}/ Mật khẩu: <code className="text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded">123456</code>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-slate-700 mt-6">
            PicBox Delivery System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
