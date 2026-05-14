"use client";

import React, { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import Footer from "./footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050a18]">
      {/* Fixed sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/*
        Main content area.
        Sidebar is `position: fixed` so it does not participate in flex flow.
        We manually add left margin on ≥lg to avoid content hiding behind sidebar.
        Classes sidebar-main-expanded / sidebar-main-collapsed are defined in globals.css.
      */}
      <div
        className={[
          "flex flex-1 flex-col min-w-0 overflow-hidden",
          "transition-[margin] duration-300 ease-in-out",
          collapsed ? "sidebar-main-collapsed" : "sidebar-main-expanded",
        ].join(" ")}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
