"use client";

import React, { useState, useEffect, useRef } from "react";
import OpsLayout from "@/components/layout/ops-layout";
import {
  Map, Truck, Navigation, Battery, Zap, Clock,
  MapPin, CheckCircle2, AlertTriangle, Play, Pause,
  RefreshCw, MessageSquare, Phone, ChevronRight
} from "lucide-react";

interface Waypoint {
  orderId: string;
  customerName: string;
  address: string;
  status: "pending" | "delivering" | "done" | "failed";
}

interface RouteMonitor {
  id: string;
  shipperName: string;
  phone: string;
  status: "delivering" | "idle" | "done";
  battery: number;
  speed: number; // km/h
  ordersCount: number;
  doneCount: number;
  codCollected: number;
  lat: number; // relative map y coord 0-100
  lng: number; // relative map x coord 0-100
  waypoints: Waypoint[];
}

const INITIAL_ROUTES: RouteMonitor[] = [
  {
    id: "R-SH01",
    shipperName: "Nguyễn Văn Tùng",
    phone: "0901234567",
    status: "delivering",
    battery: 85,
    speed: 38,
    ordersCount: 5,
    doneCount: 2,
    codCollected: 480000,
    lat: 35,
    lng: 40,
    waypoints: [
      { orderId: "PB-20260010", customerName: "Nguyễn Văn A", address: "12 Kha Vạn Cân", status: "done" },
      { orderId: "PB-20260011", customerName: "Trần Thị B", address: "85 Đường số 2", status: "done" },
      { orderId: "PB-20260012", customerName: "Lê Văn C", address: "45 Nguyễn Văn Linh", status: "delivering" },
      { orderId: "PB-20260013", customerName: "Phạm Thị D", address: "190 Quốc lộ 13", status: "pending" },
      { orderId: "PB-20260014", customerName: "Hoàng Văn E", address: "98 Tô Ngọc Vân", status: "pending" },
    ],
  },
  {
    id: "R-SH02",
    shipperName: "Lê Hoàng Nam",
    phone: "0912345678",
    status: "delivering",
    battery: 42,
    speed: 24,
    ordersCount: 4,
    doneCount: 1,
    codCollected: 120000,
    lat: 55,
    lng: 65,
    waypoints: [
      { orderId: "PB-20260015", customerName: "Bùi Thị F", address: "23 Linh Đông", status: "done" },
      { orderId: "PB-20260016", customerName: "Đặng Văn G", address: "110 Kha Vạn Cân", status: "delivering" },
      { orderId: "PB-20260017", customerName: "Ngô Thị H", address: "55 Đường 20", status: "pending" },
      { orderId: "PB-20260018", customerName: "Trịnh Văn I", address: "14 Phạm Văn Đồng", status: "pending" },
    ],
  },
  {
    id: "R-SH03",
    shipperName: "Trần Minh Quang",
    phone: "0923456789",
    status: "done",
    battery: 98,
    speed: 0,
    ordersCount: 3,
    doneCount: 3,
    codCollected: 890000,
    lat: 20,
    lng: 25,
    waypoints: [
      { orderId: "PB-20260007", customerName: "Lâm Văn K", address: "4 Tam Bình", status: "done" },
      { orderId: "PB-20260008", customerName: "Phan Thị L", address: "89 Tô Ngọc Vân", status: "done" },
      { orderId: "PB-20260009", customerName: "Vũ Văn M", address: "120 Linh Tây", status: "done" },
    ],
  },
];

export default function RouteMonitoring() {
  const [routes, setRoutes] = useState<RouteMonitor[]>(INITIAL_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("R-SH01");
  const [isWebSocketActive, setIsWebSocketActive] = useState(true);
  const [logs, setLogs] = useState<string[]>(["[WebSocket] Đã thiết lập kết nối ws://api.picbox.vn/tracking/branch_01", "[WebSocket] Đang lắng nghe kênh GPS stream của chi nhánh..."]);
  const simInterval = useRef<NodeJS.Timeout | null>(null);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  // Simulating WebSocket real-time GPS coordinate movement & updates
  useEffect(() => {
    if (isWebSocketActive) {
      simInterval.current = setInterval(() => {
        setRoutes((prev) =>
          prev.map((route) => {
            if (route.status !== "delivering") return route;

            // Shift coordinates slightly to mock driving
            const deltaLat = (Math.random() - 0.5) * 3;
            const deltaLng = (Math.random() - 0.5) * 3;
            
            // Randomly update speed slightly
            const deltaSpeed = Math.round((Math.random() - 0.5) * 8);
            const newSpeed = Math.max(15, Math.min(55, route.speed + deltaSpeed));
            
            // Battery drains slightly
            const newBattery = Math.max(5, route.battery - (Math.random() > 0.8 ? 1 : 0));

            return {
              ...route,
              lat: Math.max(10, Math.min(90, route.lat + deltaLat)),
              lng: Math.max(10, Math.min(90, route.lng + deltaLng)),
              speed: newSpeed,
              battery: newBattery,
            };
          })
        );

        // Generate mock WebSocket event logs randomly
        if (Math.random() > 0.7) {
          const activeRoutes = routes.filter((r) => r.status === "delivering");
          if (activeRoutes.length > 0) {
            const randomRoute = activeRoutes[Math.floor(Math.random() * activeRoutes.length)];
            const timeStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            const logMsg = `[WebSocket] ${timeStr} - Shipper ${randomRoute.shipperName} cập nhật GPS: (${randomRoute.lat.toFixed(2)}, ${randomRoute.lng.toFixed(2)}) · Tốc độ: ${randomRoute.speed} km/h`;
            setLogs((prev) => [logMsg, ...prev.slice(0, 15)]);
          }
        }
      }, 3000);
    } else {
      if (simInterval.current) clearInterval(simInterval.current);
    }

    return () => {
      if (simInterval.current) clearInterval(simInterval.current);
    };
  }, [isWebSocketActive, routes]);

  return (
    <OpsLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Theo dõi lộ trình (Route Monitoring)
            <span className="text-[11px] font-normal bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full">
              GPS Stream: Active
            </span>
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Bản đồ giám sát GPS và tiến trình giao hàng thời gian thực của các Shipper thuộc chi nhánh (P-O06)
          </p>
        </div>
        
        {/* WebSocket control */}
        <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/[0.06] p-1.5 rounded-2xl">
          <button
            onClick={() => {
              setIsWebSocketActive(!isWebSocketActive);
              setLogs((prev) => [
                isWebSocketActive 
                  ? "❌ [WebSocket] Đã ngắt kết nối thủ công."
                  : "🟢 [WebSocket] Đã kết nối lại kênh GPS stream.",
                ...prev
              ]);
            }}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              isWebSocketActive 
                ? "bg-sky-500/15 text-sky-300 border border-sky-500/20" 
                : "text-slate-500"
            }`}
          >
            {isWebSocketActive ? <Play size={12} className="animate-pulse" /> : <Pause size={12} />}
            {isWebSocketActive ? "Simulating WebSockets" : "Simulation Paused"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column: Active routes list */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-[14px] font-semibold text-white mb-4">Các lộ trình đang vận hành</h3>
            
            <div className="space-y-3">
              {routes.map((route) => {
                const isActive = route.id === selectedRouteId;
                const progressPercent = Math.round((route.doneCount / route.ordersCount) * 100);
                
                return (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`w-full p-4 rounded-2xl border transition-all text-left flex flex-col gap-2.5 cursor-pointer ${
                      isActive
                        ? "border-sky-500/30 bg-sky-500/[0.05]"
                        : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Truck size={14} className={isActive ? "text-sky-400" : "text-slate-400"} />
                        <span className="text-[12px] font-bold text-white">{route.shipperName}</span>
                      </div>
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        route.status === "delivering" ? "bg-sky-500/10 text-sky-400 border-sky-500/20 animate-pulse" :
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {route.status === "delivering" ? "ĐANG GIAO" : "HOÀN THÀNH"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white/[0.02] border border-white/[0.04] py-1.5 rounded-lg">
                        <p className="text-[11px] text-slate-500">Tiến trình</p>
                        <p className="text-[12px] font-bold text-white">{progressPercent}% ({route.doneCount}/{route.ordersCount})</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/[0.04] py-1.5 rounded-lg">
                        <p className="text-[11px] text-slate-500">Tốc độ</p>
                        <p className="text-[12px] font-bold text-sky-400">{route.speed} km/h</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/[0.04] py-1.5 rounded-lg">
                        <p className="text-[11px] text-slate-500">COD đã thu</p>
                        <p className="text-[12px] font-bold text-emerald-400">₫{(route.codCollected / 1000).toFixed(0)}k</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${progressPercent}%`,
                          background: "linear-gradient(90deg, #38bdf8, #34d399)"
                        }} 
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* WebSocket log feed console */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Zap size={13} className="text-sky-400" />
              Live WebSocket Logs
            </h3>
            <div className="font-mono text-[9px] text-sky-300/70 bg-black/40 rounded-xl p-3 border border-white/[0.03] space-y-1.5 max-h-40 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-slate-700">Đang chờ sự kiện...</p>
              ) : (
                logs.map((log, idx) => (
                  <p key={idx} className="leading-relaxed truncate">{log}</p>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center: Futuristic GPS Map Simulation */}
        <div className="glass rounded-2xl overflow-hidden min-h-[400px] flex flex-col relative border border-white/[0.08]">
          <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between z-10">
            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
              <Map size={15} className="text-sky-400" />
              GPS Vector Map (Bản đồ số Thủ Đức)
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Zoom: 14.5x</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="flex-1 bg-[#090601] relative overflow-hidden min-h-[350px]">
            {/* Custom stylized grid mesh background */}
            <div className="absolute inset-0" 
              style={{
                backgroundImage: "linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)",
                backgroundSize: "25px 25px"
              }} 
            />

            {/* Hub Central Marker (Thủ Đức Branch) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
              <div className="h-6 w-6 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <MapPin size={12} className="text-amber-400" />
              </div>
              <span className="absolute top-7 left-1/2 -translate-x-1/2 text-[9px] font-bold text-amber-400 whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded border border-amber-500/20">
                Hub Thủ Đức
              </span>
            </div>

            {/* GPS Markers of Shippers */}
            {routes.map((r) => {
              const isSelected = r.id === selectedRouteId;
              
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRouteId(r.id)}
                  className="absolute z-20 group transition-all duration-700 ease-out"
                  style={{
                    top: `${r.lat}%`,
                    left: `${r.lng}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  {/* Pulsing radar circle */}
                  {r.status === "delivering" && (
                    <span className="absolute inset-0 h-8 w-8 -translate-x-2 -translate-y-2 rounded-full bg-sky-400/20 animate-ping" />
                  )}

                  <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected 
                      ? "bg-sky-500 border border-white scale-125 shadow-lg shadow-sky-500/50" 
                      : "bg-[#182a3c] border border-sky-400/40 hover:scale-110"
                  }`}>
                    <Navigation 
                      size={10} 
                      className={`text-white transition-transform ${isSelected ? "text-white" : "text-sky-300"}`} 
                      style={{ transform: `rotate(${r.speed * 4}deg)` }} 
                    />
                  </div>

                  <span className={`absolute top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1 py-0.5 rounded border whitespace-nowrap transition-all ${
                    isSelected 
                      ? "bg-sky-500/95 text-white border-sky-300" 
                      : "bg-black/85 text-slate-400 border-white/[0.08] group-hover:bg-[#111]"
                  }`}>
                    {r.shipperName.split(" ").pop()} ({r.speed}k/h)
                  </span>
                </button>
              );
            })}

            {/* Map stylized background pathways (SVGs) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              {/* Primary roads */}
              <path d="M 0,150 L 500,220" stroke="#38bdf8" strokeWidth="2" fill="none" />
              <path d="M 120,0 L 220,400" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
              <path d="M 0,80 C 150,90 200,200 400,400" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
            </svg>
          </div>
        </div>

        {/* Right column: Selected Shipper details checklist */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            {/* Shipper info header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-white/[0.04] mb-4">
              <div className="h-10 w-10 rounded-xl gradient-amber flex items-center justify-center text-[14px] font-bold text-white shadow-md shadow-amber-500/15">
                {selectedRoute.shipperName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-bold text-white truncate">{selectedRoute.shipperName}</h3>
                <p className="text-[11px] text-slate-500">{selectedRoute.id} · {selectedRoute.phone}</p>
              </div>
            </div>

            {/* Quick dashboard for Selected Shipper */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 flex items-center gap-1"><Battery size={12} className="text-emerald-400" /> Thiết bị</span>
                <span className="text-[13px] font-bold text-white">{selectedRoute.battery}% Pin</span>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={12} className="text-amber-400" /> Tốc độ</span>
                <span className="text-[13px] font-bold text-white">{selectedRoute.speed} km/h</span>
              </div>
            </div>

            {/* Waypoints list */}
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-3">Lộ trình giao hàng</h4>
            
            <div className="space-y-3.5 relative">
              {/* Stepper timeline line */}
              <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-white/[0.04]" />

              {selectedRoute.waypoints.map((wp, idx) => (
                <div key={wp.orderId} className="flex items-start gap-3 relative pl-1">
                  {/* Step bullet */}
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 z-10 border transition-all ${
                    wp.status === "done" ? "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/25" :
                    wp.status === "delivering" ? "bg-sky-500/20 border-sky-400" :
                    "bg-slate-900 border-slate-700"
                  }`}>
                    {wp.status === "done" ? (
                      <CheckCircle2 size={10} className="text-white" />
                    ) : (
                      <span className={`text-[9px] font-bold ${wp.status === "delivering" ? "text-sky-400 animate-pulse" : "text-slate-600"}`}>
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Waypoint Text */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-white">{wp.orderId}</span>
                      
                      <span className={`text-[9px] font-semibold ${
                        wp.status === "done" ? "text-emerald-400" :
                        wp.status === "delivering" ? "text-sky-400 animate-pulse" :
                        "text-slate-600"
                      }`}>
                        {wp.status === "done" ? "Đã giao" :
                         wp.status === "delivering" ? "Đang giao" : "Chờ giao"}
                      </span>
                    </div>
                    <p className="text-[12px] font-medium text-slate-300 mt-0.5">{wp.customerName}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{wp.address}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions for branch manager */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-white/[0.04]">
              <a
                href={`tel:${selectedRoute.phone}`}
                className="flex-1 h-9 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] text-slate-300 text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone size={13} /> Gọi điện
              </a>
              <button
                onClick={() => alert(`Đã gửi tin nhắn SOS thông báo khẩn cấp đến shipper ${selectedRoute.shipperName}!`)}
                className="flex-1 h-9 rounded-xl border border-rose-500/25 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle size={13} /> Khẩn cấp (SOS)
              </button>
            </div>
          </div>
        </div>
      </div>
    </OpsLayout>
  );
}
