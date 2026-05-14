import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
}: StatCardProps) {
  const changeColor = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    neutral: "text-slate-400",
  };

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-slate-600/50 hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${changeColor[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
