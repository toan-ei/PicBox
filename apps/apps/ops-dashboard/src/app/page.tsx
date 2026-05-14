import { LayoutDashboard } from "lucide-react";

export default function OpsDashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/25 mb-4">
          <LayoutDashboard size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Ops Dashboard</h1>
        <p className="text-slate-400 mt-2">Đang phát triển — P-O05, P-O06, P-O09</p>
        <p className="text-xs text-slate-500 mt-1">Port: 3004</p>
      </div>
    </div>
  );
}
