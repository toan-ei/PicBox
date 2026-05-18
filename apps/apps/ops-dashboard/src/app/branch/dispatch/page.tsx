"use client";

import React, { useState } from "react";
import OpsLayout from "@/components/layout/ops-layout";
import {
  Truck, Users, Package, Clock, ShieldAlert,
  Search, Filter, Check, ShieldCheck, AlertCircle,
  TrendingUp, RefreshCw, ChevronRight, UserPlus
} from "lucide-react";

interface Shipper {
  id: string;
  name: string;
  phone: string;
  status: "online" | "offline" | "busy";
  rating: number;
  currentOrders: number;
  maxOrders: number;
  coverageWards: string[];
}

interface Order {
  id: string;
  customerName: string;
  address: string;
  ward: string;
  cod: number;
  weight: number;
  waitTime: string;
  selected?: boolean;
}

const INITIAL_SHIPPERS: Shipper[] = [
  { id: "S001", name: "Nguyễn Văn Tùng", phone: "0901234567", status: "online", rating: 4.8, currentOrders: 3, maxOrders: 15, coverageWards: ["Hiệp Bình Chánh", "Hiệp Bình Phước"] },
  { id: "S002", name: "Lê Hoàng Nam", phone: "0912345678", status: "online", rating: 4.9, currentOrders: 8, maxOrders: 15, coverageWards: ["Tam Bình", "Tam Phú"] },
  { id: "S003", name: "Trần Minh Quang", phone: "0923456789", status: "busy", rating: 4.6, currentOrders: 12, maxOrders: 12, coverageWards: ["Linh Tây", "Linh Đông"] },
  { id: "S004", name: "Phạm Quốc Huy", phone: "0934567890", status: "online", rating: 4.7, currentOrders: 0, maxOrders: 10, coverageWards: ["Linh Chiểu", "Linh Trung"] },
  { id: "S005", name: "Võ Thị Hạnh", phone: "0945678901", status: "offline", rating: 4.9, currentOrders: 0, maxOrders: 15, coverageWards: ["Bình Thọ", "Trường Thọ"] },
];

const INITIAL_ORDERS: Order[] = [
  { id: "PB-20260020", customerName: "Trần Văn Mới", address: "12 Đường 18, Hiệp Bình Chánh", ward: "Hiệp Bình Chánh", cod: 250000, weight: 1.5, waitTime: "5 phút" },
  { id: "PB-20260021", customerName: "Lê Thị Oanh", address: "45/2 Quốc lộ 13, Hiệp Bình Phước", ward: "Hiệp Bình Phước", cod: 0, weight: 0.8, waitTime: "12 phút" },
  { id: "PB-20260022", customerName: "Phạm Minh Tuấn", address: "89 Tô Ngọc Vân, Tam Bình", ward: "Tam Bình", cod: 180000, weight: 3.2, waitTime: "18 phút" },
  { id: "PB-20260023", customerName: "Nguyễn Thị Mai", address: "120 Linh Đông, Linh Đông", ward: "Linh Đông", cod: 95000, weight: 2.1, waitTime: "24 phút" },
  { id: "PB-20260024", customerName: "Đỗ Hoàng Long", address: "5 Lê Văn Chí, Linh Trung", ward: "Linh Trung", cod: 350000, weight: 4.5, waitTime: "30 phút" },
  { id: "PB-20260025", customerName: "Vũ Tiến Thành", address: "38 Kha Vạn Cân, Hiệp Bình Chánh", ward: "Hiệp Bình Chánh", cod: 0, weight: 1.1, waitTime: "35 phút" },
  { id: "PB-20260026", customerName: "Trần Cẩm Tú", address: "105 Đường 12, Tam Bình", ward: "Tam Bình", cod: 120000, weight: 0.5, waitTime: "42 phút" },
];

export default function DispatchBoard() {
  const [shippers, setShippers] = useState<Shipper[]>(INITIAL_SHIPPERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState("all");
  const [selectedShipperId, setSelectedShipperId] = useState<string>("");
  const [lockStatus, setLockStatus] = useState<"idle" | "locking" | "acquired" | "conflict">("idle");
  const [lockLog, setLockLog] = useState<string[]>([]);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const uniqueWards = Array.from(new Set(orders.map((o) => o.ward)));

  const handleToggleSelect = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, selected: !o.selected } : o))
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setOrders((prev) => prev.map((o) => ({ ...o, selected: checked })));
  };

  const selectedCount = orders.filter((o) => o.selected).length;

  const handleAssign = async () => {
    if (selectedCount === 0) {
      setToast({ type: "error", msg: "Vui lòng chọn ít nhất một đơn hàng!" });
      return;
    }
    if (!selectedShipperId) {
      setToast({ type: "error", msg: "Vui lòng chọn một shipper để phân phối!" });
      return;
    }

    const selectedShipper = shippers.find((s) => s.id === selectedShipperId)!;
    if (selectedShipper.currentOrders + selectedCount > selectedShipper.maxOrders) {
      setToast({ type: "error", msg: `Shipper ${selectedShipper.name} đã quá tải! Giới hạn tối đa là ${selectedShipper.maxOrders} đơn.` });
      return;
    }

    // Trigger Distributed Lock Simulation
    setLockStatus("locking");
    setLockLog(["[1] Đang gửi yêu cầu xác thực khoá phân tán lên Redis...", "  - Key: lock:dispatch:branch_01", "  - TTL: 10s · Client: instance_ops_3004"]);
    
    await new Promise((res) => setTimeout(res, 800));
    setLockLog((prev) => [...prev, "[2] Redis SETNX thành công. Lock acquired. Đang kiểm tra điều kiện gán đơn..."]);
    
    await new Promise((res) => setTimeout(res, 800));
    // Simulate lock conflict 15% of the time for demo purposes
    const isConflict = Math.random() < 0.15;
    if (isConflict) {
      setLockStatus("conflict");
      setLockLog((prev) => [...prev, "❌ Xung đột (Race Condition): Branch Manager khác đã gán đơn này cùng lúc!", "🔴 Huỷ thao tác để đảm bảo an toàn dữ liệu."]);
      setToast({ type: "error", msg: "Distributed Lock từ chối thao tác! Lộ trình đã bị thay đổi bởi quản trị viên khác." });
      return;
    }

    setLockStatus("acquired");
    setLockLog((prev) => [...prev, "✓ Giao dịch an toàn: Đang cập nhật bảng custody_chain & shipper_routes...", "✓ Cập nhật thành công. Giải phóng khoá phân tán (DEL lock:dispatch:branch_01)."]);

    await new Promise((res) => setTimeout(res, 600));

    // Execute changes
    const assignedIds = orders.filter((o) => o.selected).map((o) => o.id);
    
    setOrders((prev) => prev.filter((o) => !o.selected));
    setShippers((prev) =>
      prev.map((s) =>
        s.id === selectedShipperId
          ? { ...s, currentOrders: s.currentOrders + selectedCount }
          : s
      )
    );

    setToast({ type: "success", msg: `Đã phân phối thành công ${selectedCount} đơn cho Shipper ${selectedShipper.name}!` });
    setSelectedShipperId("");
    setLockStatus("idle");
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWard = selectedWard === "all" || o.ward === selectedWard;
    return matchesSearch && matchesWard;
  });

  return (
    <OpsLayout>
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Bảng điều phối giao hàng (Dispatch Board)
            <span className="text-[11px] font-normal bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Branch: Thủ Đức
            </span>
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Phân công đơn hàng chặng cuối cho đội ngũ shipper tại chi nhánh (P-O05)
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setOrders(INITIAL_ORDERS);
              setShippers(INITIAL_SHIPPERS);
              setToast({ type: "success", msg: "Đã làm mới dữ liệu mẫu!" });
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-slate-400 hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <RefreshCw size={14} /> Reset Data
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 stagger">
        {[
          { label: "Đơn chờ gán", value: orders.length, icon: Package, color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
          { label: "Shipper online", value: shippers.filter(s => s.status === "online").length, icon: Users, color: "#38bdf8", bg: "rgba(56,189,248,0.10)" },
          { label: "Đang được chọn", value: selectedCount, icon: Check, color: "#10b981", bg: "rgba(16,185,129,0.10)" },
          { label: "Quá tải (>80% công suất)", value: shippers.filter(s => (s.currentOrders/s.maxOrders) >= 0.8).length, icon: ShieldAlert, color: "#ef4444", bg: "rgba(239,68,68,0.10)" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass rounded-2xl p-4 flex items-center gap-4 animate-fadeIn">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                <Icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-[20px] font-bold text-white leading-none">{s.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 columns: Order list */}
        <div className="xl:col-span-2 space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center mb-4">
              <h3 className="text-[14px] font-semibold text-white">Danh sách đơn hàng chờ giao</h3>
              
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm mã đơn, tên khách..."
                    className="w-full h-8.5 rounded-xl bg-white/[0.03] border border-white/[0.06] pl-9 pr-4 text-[12px] text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-amber-500/40"
                  />
                </div>
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="h-8.5 px-3 rounded-xl bg-[#140e02] border border-white/[0.06] text-[12px] text-slate-300 outline-none focus:border-amber-500/40 cursor-pointer"
                >
                  <option value="all">Tất cả Phường</option>
                  {uniqueWards.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04] text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-left">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={filteredOrders.length > 0 && filteredOrders.every((o) => o.selected)}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3">Mã đơn</th>
                    <th className="px-4 py-3">Người nhận</th>
                    <th className="px-4 py-3">Phường</th>
                    <th className="px-4 py-3">Cước / COD</th>
                    <th className="px-4 py-3">Chờ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-600 text-[13px]">
                        Không có đơn hàng nào chờ gán.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        onClick={() => handleToggleSelect(order.id)}
                        className={`hover:bg-white/[0.015] transition-colors cursor-pointer ${order.selected ? "bg-amber-500/[0.02]" : ""}`}
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={order.selected || false}
                            onChange={() => handleToggleSelect(order.id)}
                            className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 font-mono text-[12px] font-bold text-white">{order.id}</td>
                        <td className="px-4 py-3">
                          <p className="text-[12px] font-medium text-slate-300">{order.customerName}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{order.address}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] bg-slate-500/10 text-slate-400 px-2 py-0.5 rounded-full border border-slate-500/10 font-semibold">
                            {order.ward}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {order.cod > 0 ? (
                            <p className="text-[12px] font-bold text-emerald-400">COD: ₫{order.cod.toLocaleString()}</p>
                          ) : (
                            <p className="text-[11px] text-slate-500">Đã thanh toán</p>
                          )}
                          <p className="text-[10px] text-slate-600">Nặng: {order.weight} kg</p>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-amber-500 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={10} /> {order.waitTime}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: Shipper selection & Assignment actions */}
        <div className="space-y-4">
          {/* Distributed Lock Console */}
          {lockStatus !== "idle" && (
            <div className="glass border-rose-500/25 bg-rose-500/[0.02] rounded-2xl p-5 animate-slideDown">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 mb-3">
                <ShieldAlert size={14} className="animate-pulse" />
                Redis Distributed Lock Console
              </h4>
              <div className="font-mono text-[10px] text-rose-300/80 bg-black/45 rounded-xl p-3 space-y-1.5 border border-rose-500/10 max-h-36 overflow-y-auto">
                {lockLog.map((log, idx) => (
                  <p key={idx} className="leading-relaxed">{log}</p>
                ))}
              </div>
              {lockStatus === "locking" && (
                <div className="flex items-center justify-center gap-2 mt-4 text-[12px] text-rose-400">
                  <RefreshCw size={12} className="animate-spin" />
                  Đang ghi đè lock phân tán chống Race Condition...
                </div>
              )}
            </div>
          )}

          {/* Shipper selection */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
              <Users size={16} className="text-amber-400" />
              Chọn Shipper nhận đơn
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {shippers.map((shipper) => {
                const loadPercent = Math.round((shipper.currentOrders / shipper.maxOrders) * 100);
                const isOverloaded = loadPercent >= 80;
                
                return (
                  <button
                    key={shipper.id}
                    disabled={shipper.status === "offline"}
                    onClick={() => setSelectedShipperId(shipper.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      shipper.status === "offline" ? "opacity-35 cursor-not-allowed border-transparent" : "cursor-pointer"
                    } ${
                      selectedShipperId === shipper.id
                        ? "border-amber-500/30 bg-amber-500/[0.06]"
                        : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          shipper.status === "online" ? "bg-emerald-400 animate-pulse" :
                          shipper.status === "busy" ? "bg-rose-400" : "bg-slate-600"
                        }`} />
                        <p className="text-[12px] font-bold text-white truncate">{shipper.name}</p>
                      </div>
                      <p className="text-[10px] text-slate-500">Phụ trách: {shipper.coverageWards.join(", ")}</p>
                      
                      {/* Easing progress bar */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: `${loadPercent}%`,
                              backgroundColor: isOverloaded ? "#ef4444" : "#38bdf8"
                            }} 
                          />
                        </div>
                        <span className={`text-[9px] font-bold ${isOverloaded ? "text-rose-400" : "text-slate-400"}`}>
                          {shipper.currentOrders}/{shipper.maxOrders} đơn
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-600 ml-2" />
                  </button>
                );
              })}
            </div>

            {/* Submit Action */}
            <div className="mt-5 pt-4 border-t border-white/[0.04]">
              <div className="flex justify-between text-[12px] mb-3 text-slate-500">
                <span>Số đơn đã chọn:</span>
                <span className="text-white font-bold">{selectedCount} đơn</span>
              </div>
              <button
                onClick={handleAssign}
                disabled={selectedCount === 0 || !selectedShipperId || lockStatus === "locking"}
                className="w-full h-11 rounded-xl text-white text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ 
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                  boxShadow: selectedCount > 0 && selectedShipperId ? "0 4px 16px -4px rgba(245,158,11,0.5)" : "none"
                }}
              >
                <UserPlus size={15} /> Phân đơn & Tạo lộ trình
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border animate-slideDown shadow-2xl"
          style={
            toast.type === "success"
              ? { background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.25)", color: "#34d399" }
              : { background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.25)", color: "#f87171" }
          }>
          {toast.type === "success" ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
          <span className="text-[12px] font-semibold">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-[10px] hover:text-white font-bold opacity-60">✕</button>
        </div>
      )}
    </OpsLayout>
  );
}
