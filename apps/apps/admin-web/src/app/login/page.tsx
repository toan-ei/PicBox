"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Package, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

/* ─────────────────────────────────────────────
   Spinner component
───────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  // Focus states for neon border effect
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  /* ── Shake trigger ── */
  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1400));

    if (email === "admin" && password === "123456") {
      localStorage.setItem("accessToken", "demo-token");
      localStorage.setItem("user", JSON.stringify({ name: "Admin", role: "admin" }));
      router.push("/");
    } else {
      setLoading(false);
      setError("Tài khoản hoặc mật khẩu không chính xác.");
      triggerShake();
    }
  }

  /* ── Input field helper ── */
  function inputClass(focused: boolean, hasError: boolean) {
    return [
      "w-full h-12 rounded-2xl pl-11 pr-4",
      "bg-white/[0.04] text-[14px] text-white placeholder-slate-600",
      "outline-none transition-all duration-300",
      "border",
      hasError
        ? "border-rose-500/50 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
        : focused
        ? "border-violet-500/60 shadow-[0_0_0_3px_rgba(139,92,246,0.15)] bg-white/[0.06]"
        : "border-white/[0.08] hover:border-white/[0.14]",
    ].join(" ");
  }

  const hasError = Boolean(error);

  return (
    <>
      {/* ── Global styles injected inline ── */}
      <style>{`
        @keyframes meshMove1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(60px, -40px) scale(1.15); }
          66%  { transform: translate(-30px, 50px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes meshMove2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(-50px, 60px) scale(1.1); }
          66%  { transform: translate(40px, -30px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes meshMove3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(30px, 30px) scale(1.08); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-8px); }
          30%     { transform: translateX(8px); }
          45%     { transform: translateX(-6px); }
          60%     { transform: translateX(6px); }
          75%     { transform: translateX(-3px); }
          90%     { transform: translateX(3px); }
        }
        @keyframes errorSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mesh-blob-1 {
          animation: meshMove1 14s ease-in-out infinite;
        }
        .mesh-blob-2 {
          animation: meshMove2 18s ease-in-out infinite;
        }
        .mesh-blob-3 {
          animation: meshMove3 22s ease-in-out infinite;
        }
        .card-enter {
          animation: cardIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }
        .shake {
          animation: shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both;
        }
        .error-slide {
          animation: errorSlide 0.3s ease-out both;
        }
      `}</style>

      {/* ──────────────────────────────────────────
          Page wrapper
      ────────────────────────────────────────── */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#04071a]">

        {/* ── Animated Mesh Gradient Background ── */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          {/* Blob 1 — Deep Blue */}
          <div
            className="mesh-blob-1 absolute -top-[200px] -left-[150px] w-[700px] h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          {/* Blob 2 — Dark Purple */}
          <div
            className="mesh-blob-2 absolute -bottom-[200px] -right-[150px] w-[750px] h-[750px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          {/* Blob 3 — Indigo center glow */}
          <div
            className="mesh-blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        {/* ── Login Card ── */}
        <div
          ref={cardRef}
          className={`card-enter relative z-10 w-full max-w-[420px] mx-4 ${shake ? "shake" : ""}`}
        >
          <div
            className="rounded-3xl p-8"
            style={{
              background: "rgba(10, 14, 35, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.06), 0 0 60px -20px rgba(139,92,246,0.25)",
            }}
          >
            {/* ── Logo ── */}
            <div className="flex flex-col items-center mb-10">
              <div
                className="flex h-[64px] w-[64px] items-center justify-center rounded-2xl mb-5"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%)",
                  boxShadow: "0 8px 32px -4px rgba(139,92,246,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                <Package size={28} className="text-white" />
              </div>
              <h1 className="text-[22px] font-bold text-white tracking-tight">Chào mừng trở lại</h1>
              <p className="text-[13px] text-slate-500 mt-1.5">Đăng nhập vào PicBox Admin</p>
            </div>

            {/* ── Error banner ── */}
            {error && (
              <div
                className="error-slide mb-5 rounded-xl px-4 py-3 flex items-start gap-2.5"
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.18)",
                }}
              >
                <span className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-[10px] font-bold">!</span>
                <p className="text-[13px] text-rose-400 leading-relaxed">{error}</p>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email / Username */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-semibold text-slate-400 tracking-wide uppercase">
                  Tài khoản
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      emailFocused ? "text-violet-400" : hasError ? "text-rose-400/60" : "text-slate-600"
                    }`}
                  />
                  <input
                    id="login-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="admin"
                    required
                    autoComplete="username"
                    className={inputClass(emailFocused, hasError)}
                    style={{ paddingLeft: "2.75rem" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-semibold text-slate-400 tracking-wide uppercase">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      passFocused ? "text-violet-400" : hasError ? "text-rose-400/60" : "text-slate-600"
                    }`}
                  />
                  <input
                    id="login-password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPassFocused(true)}
                    onBlur={() => setPassFocused(false)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className={inputClass(passFocused, hasError)}
                    style={{ paddingLeft: "2.75rem", paddingRight: "3rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors duration-200 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                  <div
                    onClick={() => setRemember((v) => !v)}
                    className={`h-4 w-4 rounded-[5px] border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      remember
                        ? "bg-violet-500 border-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                        : "bg-transparent border-white/[0.15] hover:border-violet-500/50"
                    }`}
                  >
                    {remember && (
                      <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[12px] text-slate-500 group-hover:text-slate-400 transition-colors">
                    Ghi nhớ đăng nhập
                  </span>
                </label>
                <a
                  href="#"
                  className="text-[12px] text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit button */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-2xl text-white text-[14px] font-semibold flex items-center justify-center gap-2.5 cursor-pointer select-none mt-2"
                style={{
                  background: loading
                    ? "linear-gradient(135deg, #4c1d95 0%, #312e81 100%)"
                    : "linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #3b82f6 100%)",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 24px -4px rgba(99,102,241,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
                  transition: "all 0.2s ease",
                  transform: "scale(1)",
                  opacity: loading ? 0.75 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
                onMouseDown={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)";
                }}
                onMouseUp={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
                }}
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* ── Divider ── */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
              </div>
              <div className="relative flex justify-center">
                <span
                  className="px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-700"
                  style={{ background: "rgba(10,14,35,0.75)" }}
                >
                  Demo Account
                </span>
              </div>
            </div>

            {/* ── Demo hint ── */}
            <div
              className="rounded-2xl px-4 py-3.5"
              style={{
                background: "rgba(99,102,241,0.05)",
                border: "1px solid rgba(99,102,241,0.12)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={13} className="text-indigo-400" />
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Thông tin thử nghiệm</span>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-slate-400 flex-wrap">
                <span>
                  Tài khoản:{" "}
                  <code
                    className="text-indigo-300 font-mono rounded px-1.5 py-0.5 text-[11px]"
                    style={{ background: "rgba(99,102,241,0.12)" }}
                  >
                    admin
                  </code>
                </span>
                <span className="text-slate-700">•</span>
                <span>
                  Mật khẩu:{" "}
                  <code
                    className="text-indigo-300 font-mono rounded px-1.5 py-0.5 text-[11px]"
                    style={{ background: "rgba(99,102,241,0.12)" }}
                  >
                    123456
                  </code>
                </span>
              </div>
            </div>

            {/* ── Footer ── */}
            <p className="text-center text-[11px] text-slate-700 mt-6">
              © {new Date().getFullYear()} PicBox Delivery System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
