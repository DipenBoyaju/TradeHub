"use client";

import { useState } from "react";
import { SidebarNav } from "@/app/features/dashboard/components/Sidebar";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isTabletCollapsed, setIsTabletCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800 antialiased md:flex-row">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 md:hidden">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          aria-label="Open Mobile Menu"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          Menu
        </button>

        <span className="text-xs font-semibold text-slate-500">My Trade Hub</span>
      </header>

      <SidebarNav
        isMobileOpen={isMobileOpen}
        isTabletCollapsed={isTabletCollapsed}
        onCloseMobile={() => setIsMobileOpen(false)}
        onToggleTablet={() => setIsTabletCollapsed(!isTabletCollapsed)}
      />

      <main className="flex-1 bg-white px-4 py-6 sm:px-8 lg:px-12 lg:py-8 transition-all duration-300">
        <div className="">
          <nav className="mb-6 text-xs font-medium text-slate-400">
            <Link href="/" className="hover:text-slate-600 hover:underline">
              Home
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-500">My Trade Hub</span>
          </nav>
          {children}
        </div>
      </main>
    </div>
  );
}