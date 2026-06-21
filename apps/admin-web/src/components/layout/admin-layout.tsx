"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import Header from "./header";
import Footer from "./footer";

interface AdminLayoutProps {
  readonly children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  // Auth guard – redirect to login if no token
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#050a18]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={[
          "flex flex-1 flex-col min-w-0 overflow-hidden",
          "transition-[margin] duration-300 ease-in-out",
          collapsed ? "sidebar-main-collapsed" : "sidebar-main-expanded",
        ].join(" ")}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-5 lg:p-6">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
