"use client";

import React, { useState } from "react";
import OpsLayout from "@/components/layout/ops-layout";
import {
  QrCode, Package, ArrowRight, Printer, AlertCircle,
  Play, CheckCircle2, History, Layers, ExternalLink,
  Barcode, RefreshCw
} from "lucide-react";

interface MockPackage {
  id: string;
  sender: string;
  destination: string;
  weight: number;
  lane: string;
  gate: string;
}

interface SortedItem {
  id: string;
  destination: string;
  lane: string;
  gate: string;
  time: string;
  status: "success" | "error";
}

const PARCELS_TO_SORT: MockPackage[] = [
  { id: "PB-20260020", sender: "Cửa hàng Áo Đẹp", destination: "Thủ Đức, TP.HCM", weight: 1.5, lane: "LANE-03", gate: "Cổng A2" },
  { id: "PB-20260021", sender: "Mỹ Phẩm Xinh", destination: "Quận 1, TP.HCM", weight: 0.8, lane: "LANE-01", gate: "Cổng A1" },
  { id: "PB-20260022", sender: "Gia Dụng Việt", destination: "Bình Dương", weight: 3.2, lane: "LANE-05", gate: "Cổng B1" },
  { id: "PB-20260023", sender: "Giày Sneaker HN", destination: "Gò Vấp, TP.HCM", weight: 2.1, lane: "LANE-02", gate: "Cổng A1" },
  { id: "PB-20260024", sender: "Sách Hay Club", destination: "Bình Thạnh, TP.HCM", weight: 1.1, lane: "LANE-02", gate: "Cổng A1" },
];

export default function SortingStation() {
  const [packages, setPackages] = useState<MockPackage[]>(PARCELS_TO_SORT);
  const [currentPackage, setCurrentPackage] = useState<MockPackage | null>(null);
  const [scanHistory, setScanHistory] = useState<SortedItem[]>([
    { id: "PB-20260018", destination: "Quận 7, TP.HCM", lane: "LANE-04", gate: "Cổng B2", time: "18:29:15", status: "success" },
    { id: "PB-20260019", destination: "Thủ Đức, TP.HCM", lane: "LANE-03", gate: "Cổng A2", time: "18:28:42", status: "success" },
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [printerStatus, setPrinterStatus] = useState<"idle" | "printing" | "printed">("idle");
  const [toast, setToast] = useState<string | null>(null);

  const handleScan = async (pkg: MockPackage) => {
    setIsScanning(true);
    setCurrentPackage(null);
    setPrinterStatus("idle");

    // Simulate sorting system processing lane assignment & barcode scanning
    await new Promise((res) => setTimeout(res, 600));
    
    setCurrentPackage(pkg);
    setIsScanning(false);
    
    // Log to history
    const timeStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setScanHistory((prev) => [
      { id: pkg.id, destination: pkg.destination, lane: pkg.lane, gate: pkg.gate, time: timeStr, status: "success" },
      ...prev
    ]);

    // Remove from backlog
    setPackages((prev) => prev.filter((p) => p.id !== pkg.id));

    // Simulate auto label printing
    setPrinterStatus("printing");
    await new Promise((res) => setTimeout(res, 800));
    setPrinterStatus("printed");
  };

  const handleReprint = () => {
    setPrinterStatus("printing");
    setTimeout(() => {
      setPrinterStatus("printed");
      setToast("Đã gửi lệnh in lại đến máy in Zebra-305...");
      setTimeout(() => setToast(null), 2000);
    }, 600);
  };

  return (
    <OpsLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Trạm phân loại (Sorting Station)
            <span className="text-[11px] font-normal bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Sorter Gate: Active
            </span>
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Quét mã vạch đơn hàng nhập kho, tự động gán máng chia vật lý (Lane/Gate) và in tem phụ phân loại (P-O09)
          </p>
        </div>
        <div>
          <button
            onClick={() => {
              setPackages(PARCELS_TO_SORT);
              setCurrentPackage(null);
              setPrinterStatus("idle");
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-slate-400 hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <RefreshCw size={14} /> Reset Backlog
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Package backlog scanner simulator */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-white">Kiện hàng mới nhập kho</h3>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                {packages.length} Chờ xử lý
              </span>
            </div>

            <div className="space-y-2.5">
              {packages.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/[0.04] rounded-2xl">
                  <Package className="mx-auto text-slate-700 mb-2" size={24} />
                  <p className="text-slate-500 text-[12px]">Hết đơn hàng chờ phân loại.</p>
                </div>
              ) : (
                packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handleScan(pkg)}
                    disabled={isScanning}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/30 hover:bg-emerald-500/[0.01] transition-all text-left group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-white group-hover:text-emerald-400 transition-colors">{pkg.id}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Nguồn: {pkg.sender}</p>
                      <p className="text-[11px] text-slate-400 mt-1 font-semibold">Đến: {pkg.destination}</p>
                    </div>
                    
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <QrCode size={14} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center: Live Laser Scanner & Lane visual display */}
        <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center min-h-[400px] relative border border-white/[0.08]">
          {isScanning && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-20 flex flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-[13px] text-emerald-400 font-mono animate-pulse">Lắp ráp dữ liệu Laser Scanner...</p>
            </div>
          )}

          {!currentPackage ? (
            <div className="text-center py-20 text-slate-500 max-w-xs">
              <QrCode size={40} className="mx-auto text-emerald-500/40 mb-4 animate-pulse-dot" />
              <h3 className="text-[14px] font-bold text-white mb-1">Thiết bị quét đang hoạt động</h3>
              <p className="text-[12px]">Chọn quét một kiện hàng bên trái để kiểm tra phân luồng máng chia tự động.</p>
            </div>
          ) : (
            <div className="w-full text-center space-y-6 animate-fadeIn">
              {/* Visual Lane Glowing Screen */}
              <div className="rounded-2xl border p-6 flex flex-col items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.02) 100%)",
                  borderColor: "rgba(16,185,129,0.3)",
                  boxShadow: "0 0 30px -10px rgba(16,185,129,0.4)"
                }}>
                <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-[0.2em] mb-1">
                  Máng phân loại chỉ định
                </span>
                <p className="text-[44px] font-black text-white leading-none tracking-wider mb-2 font-mono drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                  {currentPackage.lane}
                </p>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[12px] font-bold border border-emerald-500/20">
                  <CheckCircle2 size={13} /> {currentPackage.gate}
                </div>
              </div>

              {/* Belt diagram flow */}
              <div className="flex items-center justify-center gap-4 bg-white/[0.01] border border-white/[0.04] p-3.5 rounded-xl text-[12px]">
                <span className="text-slate-500">Băng chuyền chính</span>
                <ArrowRight size={14} className="text-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-semibold">Cụm Phân Phối A</span>
                <ArrowRight size={14} className="text-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold font-mono">{currentPackage.lane}</span>
              </div>

              {/* Scanned Package Metadata */}
              <div className="grid grid-cols-2 gap-2 text-left text-[11px] bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl">
                <div>
                  <span className="text-slate-500">Mã kiện hàng:</span>
                  <p className="text-white font-mono font-bold">{currentPackage.id}</p>
                </div>
                <div>
                  <span className="text-slate-500">Nơi nhận:</span>
                  <p className="text-white font-bold">{currentPackage.destination}</p>
                </div>
                <div className="mt-1">
                  <span className="text-slate-500">Khối lượng:</span>
                  <p className="text-white font-bold">{currentPackage.weight} kg</p>
                </div>
                <div className="mt-1">
                  <span className="text-slate-500">Thời gian quét:</span>
                  <p className="text-emerald-400 font-mono font-bold">18:30:05</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Simulated Label Auto-Printer & Recent Scan Log */}
        <div className="space-y-4">
          {/* Printer status mockup */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
              <Printer size={16} className="text-emerald-400" />
              Máy in tem phân loại (Zebra-305)
            </h3>

            {printerStatus === "idle" && (
              <div className="text-center py-6 text-[12px] text-slate-600 bg-white/[0.01] border border-dashed border-white/[0.04] rounded-xl">
                Đang chờ kiện hàng được quét...
              </div>
            )}

            {printerStatus === "printing" && (
              <div className="flex flex-col items-center justify-center py-6 gap-2 text-[12px] text-emerald-400">
                <RefreshCw size={18} className="animate-spin" />
                Đang tự động xuất tem Barcode...
              </div>
            )}

            {printerStatus === "printed" && currentPackage && (
              <div className="space-y-4 animate-slideDown">
                {/* Barcode label ticket mockup */}
                <div className="bg-white text-slate-900 rounded-xl p-4 shadow-xl border border-slate-200 select-none">
                  <div className="flex justify-between items-start pb-2 border-b border-dashed border-slate-300">
                    <div>
                      <p className="text-[13px] font-extrabold tracking-wider">{currentPackage.id}</p>
                      <p className="text-[8px] text-slate-500 font-mono">{currentPackage.destination.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-black font-mono">{currentPackage.lane}</p>
                      <p className="text-[8px] font-bold bg-slate-200 px-1 py-0.5 rounded">{currentPackage.gate}</p>
                    </div>
                  </div>

                  <div className="py-3 flex flex-col items-center justify-center">
                    {/* Mock Barcode display */}
                    <div className="flex items-center gap-0.5 h-10 w-full justify-center">
                      {[1,3,1,1,4,2,1,3,1,2,4,1,2,1,3,1,2,3,1,4,1,1].map((w, i) => (
                        <div key={i} className="bg-slate-900 h-full" style={{ width: `${w * 1.5}px` }} />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono mt-1 font-bold">*(128) {currentPackage.id}*</span>
                  </div>

                  <div className="flex justify-between items-center text-[8px] text-slate-600 pt-1.5 border-t border-dashed border-slate-200">
                    <span>PicBox Sorter v1.0</span>
                    <span>W: {currentPackage.weight} kg</span>
                  </div>
                </div>

                <button
                  onClick={handleReprint}
                  className="w-full h-9 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-slate-300 text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} /> In lại tem phân loại
                </button>
              </div>
            )}
          </div>

          {/* Historical Logs */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-[14px] font-semibold text-white mb-3 flex items-center gap-2">
              <History size={15} className="text-emerald-400" />
              Lịch sử quét gần đây
            </h3>
            
            <div className="divide-y divide-white/[0.03]">
              {scanHistory.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex items-center justify-between py-2.5 text-[11px]">
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-white">{item.id}</p>
                    <p className="text-slate-500 truncate max-w-[140px]">{item.destination}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400">{item.lane}</span>
                    <p className="text-[10px] text-slate-700">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border animate-slideDown shadow-2xl bg-emerald-500/10 border-emerald-500/25 text-emerald-400">
          <CheckCircle2 size={16} />
          <span className="text-[12px] font-semibold">{toast}</span>
        </div>
      )}
    </OpsLayout>
  );
}
