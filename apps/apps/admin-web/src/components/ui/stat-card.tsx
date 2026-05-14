import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
}

export default function StatCard({ title, value, change, changeType = "neutral", icon }: StatCardProps) {
  const changeColor = {
    positive: "text-emerald-400",
    negative: "text-rose-400",
    neutral: "text-slate-500",
  };

  return (
    <div className="group rounded-2xl glass p-5 transition-all duration-300 hover:border-indigo-500/20 hover:glow-sm animate-fadeIn">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-[28px] font-bold text-white leading-none mt-2">{value}</p>
          {change && (
            <p className={`text-[12px] mt-2 font-medium ${changeColor[changeType]}`}>{change}</p>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/[0.08] text-indigo-400 group-hover:bg-indigo-500/[0.15] transition-colors">
          {icon}
        </div>
      </div>
    </div>
  );
}
