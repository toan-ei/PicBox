import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const styles: Record<BadgeVariant, string> = {
  default: "bg-slate-500/10 text-slate-400 border-slate-500/15",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/15",
  danger: "bg-rose-500/10 text-rose-400 border-rose-500/15",
  info: "bg-sky-500/10 text-sky-400 border-sky-500/15",
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${styles[variant]}`}>
      {children}
    </span>
  );
}
