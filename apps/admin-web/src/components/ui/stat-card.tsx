import React from "react";

interface StatCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly change?: string;
  readonly changeType?: "positive" | "negative" | "neutral";
  readonly icon: React.ReactNode;
}

const changeColor = {
  positive: "text-emerald-400",
  negative: "text-rose-400",
  neutral:  "text-slate-500",
};

export default function StatCard({ title, value, change, changeType = "neutral", icon }: StatCardProps) {
  return (
    <div className="group rounded-2xl glass p-5 transition-all duration-200 hover:border-indigo-500/20 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">{title}</p>
          <p className="text-[28px] font-bold text-white leading-none pt-1">{value}</p>
          {change && (
            <p className={`text-[12px] font-medium pt-0.5 ${changeColor[changeType]}`}>{change}</p>
          )}
        </div>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/[0.08] text-indigo-400 group-hover:bg-indigo-500/[0.14] transition-colors">
          {icon}
        </div>
      </div>
    </div>
  );
}
