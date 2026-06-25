"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { apiLogin } from "@picbox/utils";

export default function DriverLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(""); setLoading(true);
    try {
      const result = await apiLogin(username, password);
      localStorage.setItem("accessToken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Tài khoản hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020f0a] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #34d399 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="relative z-10 w-full max-w-[420px] mx-4">
        <div className="rounded-3xl p-8"
          style={{ background: "rgba(2,15,10,0.88)", backdropFilter: "blur(24px)", border: "1px solid rgba(52,211,153,0.12)", boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 60px -20px rgba(16,185,129,0.2)" }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #10b981, #34d399)", boxShadow: "0 8px 24px -4px rgba(16,185,129,0.5)" }}>
              <Truck size={28} className="text-white" />
            </div>
            <h1 className="text-[22px] font-bold text-white">Driver Portal</h1>
            <p className="text-[13px] text-slate-500 mt-1">Đăng nhập để xem lịch trình vận chuyển</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl px-4 py-3 text-[13px] text-rose-400"
              style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tài khoản</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="driver001@picbox.vn"
                  autoComplete="username"
                  autoFocus
                  required
                  className="w-full h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] pl-10 pr-4 text-[13px] text-white placeholder-slate-600 outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] pl-10 pr-11 text-[13px] text-white placeholder-slate-600 outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || !username || !password}
              className="w-full h-11 rounded-xl text-white text-[14px] font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
              style={{ background: "linear-gradient(135deg, #10b981, #34d399)", boxShadow: "0 4px 20px -4px rgba(16,185,129,0.5)" }}>
              {loading ? "Đang đăng nhập..." : <><span>Đăng nhập</span><ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-5 rounded-xl px-4 py-3"
            style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
            <p className="text-[11px] text-emerald-400/70 font-semibold uppercase tracking-wider mb-1.5">Tài khoản test</p>
            <p className="text-[12px] text-slate-400 font-mono">driver001@picbox.vn — driver020@picbox.vn</p>
            <p className="text-[12px] text-slate-500 font-mono">Mật khẩu: <span className="text-slate-300">Driver@123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
