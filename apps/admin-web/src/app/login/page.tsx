"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Package, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { apiLogin } from "@picbox/utils";

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

    try {
      const { token, user } = await apiLogin(email, password);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `auth_token=${token};path=/;max-age=86400`;
      router.push("/");
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Tài khoản hoặc mật khẩu không chính xác.");
      triggerShake();
    }
  }

  /* ── Input field helper ── */
  function inputClass(focused: boolean, hasError: boolean) {
    return [
      "w-full h-[56px] rounded-2xl pl-12 pr-4 tracking-wide leading-[1.8]",
      "bg-white/[0.04] text-[15px] text-white placeholder-slate-600",
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
          className={`card-enter relative z-10 w-full max-w-[480px] mx-4 ${shake ? "shake" : ""}`}
        >
          <div
            className="rounded-[2rem] px-8 py-12"
            style={{
              background: "rgba(10, 14, 35, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.06), 0 0 60px -20px rgba(139,92,246,0.25)",
              paddingLeft: "32px",
              paddingRight: "32px",
              paddingTop: "48px",
              paddingBottom: "48px",
            }}
          >
            {/* ── Logo ── */}
            <div className="flex flex-col items-center mb-12">
              <div
                className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl mb-6"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%)",
                  boxShadow: "0 8px 32px -4px rgba(139,92,246,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                <Package size={32} className="text-white" />
              </div>
              <h1 className="text-[26px] font-bold text-white tracking-tight leading-snug">Chào mừng trở lại</h1>
              <p className="text-[15px] text-slate-400 mt-3 tracking-wide leading-[1.8]">Đăng nhập vào PicBox Admin</p>
            </div>

            {/* ── Error banner ── */}
            {error && (
              <div
                className="error-slide mb-6 rounded-xl px-5 py-4 flex items-start gap-3"
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.18)",
                }}
              >
                <span className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-[12px] font-bold">!</span>
                <p className="text-[14px] text-rose-400 leading-relaxed tracking-wide">{error}</p>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Email / Username */}
              <div style={{ marginBottom: "24px" }}>
                <label className="block text-[13px] font-semibold text-[#E2E8F0] tracking-[0.08em] uppercase leading-relaxed mb-2">
                  Tài khoản
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${emailFocused ? "text-violet-400" : hasError ? "text-rose-400/60" : "text-slate-500"
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
                    autoFocus
                    autoComplete="username"
                    className={inputClass(emailFocused, hasError)}
                    style={{ paddingLeft: "54px", paddingRight: "16px" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-semibold text-[#E2E8F0] tracking-[0.08em] uppercase leading-relaxed mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${passFocused ? "text-violet-400" : hasError ? "text-rose-400/60" : "text-slate-500"
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
                    style={{ paddingLeft: "54px", paddingRight: "54px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200 cursor-pointer flex items-center justify-center w-6 h-6"
                    tabIndex={-1}
                  >
                    <EyeOff size={18} className={`absolute transition-all duration-300 ${showPass ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"}`} />
                    <Eye size={18} className={`absolute transition-all duration-300 ${!showPass ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-90"}`} />
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between" style={{ marginTop: "16px", marginBottom: "24px" }}>
                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                  <div
                    onClick={() => setRemember((v) => !v)}
                    className={`h-4 w-4 rounded border flex items-center justify-center transition-all duration-200 cursor-pointer ${remember
                      ? "bg-violet-500 border-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                      : "bg-transparent border-white/[0.2] group-hover:border-violet-500/50"
                      }`}
                  >
                    {remember && (
                      <svg
                        className="h-2.5 w-2.5 text-white"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  <span className="text-[14px] leading-[18px] tracking-wide text-[#A3AED0] group-hover:text-white transition-colors translate-y-[2px]">
                    Ghi nhớ đăng nhập
                  </span>
                </label>

                <a
                  href="/forgot-password"
                  className="text-[14px] leading-[18px] font-medium tracking-wide text-violet-300 hover:text-white transition-colors translate-y-[2px]"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit button */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading || !email || !password}
                className="w-full rounded-2xl text-white text-[15px] font-semibold tracking-wide flex items-center justify-center gap-2.5 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  paddingTop: "14px",
                  paddingBottom: "14px",
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
                  if (!loading && email && password) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
                onMouseDown={(e) => {
                  if (!loading && email && password) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                }}
                onMouseUp={(e) => {
                  if (!loading && email && password) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
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
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

        {/* ── Footer ── */}
        <p className="absolute bottom-6 left-0 right-0 text-center text-[13px] tracking-wide text-slate-500">
          © {new Date().getFullYear()} PicBox Delivery System. All rights reserved.
        </p>
      </div>
    </>
  );
}
