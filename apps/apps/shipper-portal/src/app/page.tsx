import { Package } from "lucide-react";

export default function ShipperPortalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-xl shadow-sky-500/25 mb-4">
          <Package size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Shipper Portal</h1>
        <p className="text-slate-400 mt-2">Đang phát triển — P-SH01 → P-SH12</p>
        <p className="text-xs text-slate-500 mt-1">Port: 3002</p>
      </div>
    </div>
  );
}
