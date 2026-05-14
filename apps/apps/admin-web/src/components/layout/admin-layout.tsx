"use client";

import React, { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import Footer from "./footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050a18]">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-[260px]"
        }`}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
