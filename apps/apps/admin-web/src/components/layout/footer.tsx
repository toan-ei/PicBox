import React from "react";
import { Package, Github, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#050a18]/60 px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <Package size={12} className="text-indigo-500/50" />
          <span>&copy; {new Date().getFullYear()} PicBox Delivery System.</span>
          <span className="hidden sm:inline">All rights reserved.</span>
        </div>

        {/* Center */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/[0.08] text-emerald-500 border border-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            All systems operational
          </span>
          <span className="text-slate-700">•</span>
          <span>v1.0.0</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 text-[11px] text-slate-600">
          <a href="#" className="hover:text-slate-400 transition-colors flex items-center gap-1">
            Docs <ExternalLink size={10} />
          </a>
          <a href="#" className="hover:text-slate-400 transition-colors flex items-center gap-1">
            API <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </footer>
  );
}
